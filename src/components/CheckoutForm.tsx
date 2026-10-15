import React, { useState } from 'react';
import { useCart } from 'src/context/CartContext';
import type { CartItem } from 'src/context/CartContext';
import { send } from '@emailjs/browser';

export const CheckoutForm: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Ваша корзина пуста! Добавьте товары перед оформлением заказа.');
      return;
    }
    
    if (!phone.trim()) {
      alert('Пожалуйста, введите ваш номер телефона.');
      return;
    }
    
    // 1. КОНТРОЛЬ НОМЕРА ТЕЛЕФОНА
    const allowedChars = "0123456789 +-()";
    for (let i = 0; i < phone.length; i++) {
      if (!allowedChars.includes(phone[i])) {
        alert('Номер телефона может содержать только цифры и знаки (+, -, пробелы, скобки). Буквы не допускаются!');
        return;
      }
    }
    
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 9 || digitsOnly.length > 15) {
      alert(`Пожалуйста, введите корректный номер телефона. Вы ввели ${digitsOnly.length} цифр, а должно быть от 9 до 15.`);
      return;
    }
    
    // 2. УМНЫЙ КОНТРОЛЬ АДРЕСА / EMAIL
    const trimmedAddress = address.trim();
    if (trimmedAddress) {
      const sanitizedAddress = trimmedAddress.replace(/,/g, '.').toLowerCase();
      const hasAt = sanitizedAddress.includes('@');
      const commonDomains = ['.ua', '.com', '.ru', '.net', '.org', '.biz', '.info', '.me', '.edu', '.gov'];
      const hasDomainEnding = commonDomains.some(domain => sanitizedAddress.endsWith(domain));
      
      if (hasAt || hasDomainEnding) {
        const atIndex = sanitizedAddress.indexOf('@');
        const lastDotIndex = sanitizedAddress.lastIndexOf('.');
        const isCorrectEmail = hasAt && atIndex > 0 && lastDotIndex > atIndex + 1;
        
        if (!isCorrectEmail) {
          alert('Похоже, вы ввели некорректный адрес электронной почты. Проверьте правильность написания и обязательно укажите символ @ (например, user@example.com).');
          return;
        }
      }
    }
    
    // 3. ФОРМИРОВАНИЕ СПИСКА ТОВАРОВ
    const itemsList = items
      .map((item: CartItem) => `• ${item.name} x ${item.quantity} шт. (${item.price * item.quantity} $)`)
      .join('\n');
    
    // 4. ПОДГОТОВКА ДАННЫХ ДЛЯ ШАБЛОНА EMAILJS
    const templateParams = {
      to_name: "Администратор магазина",
      user_name: name || 'Не указано',
      user_phone: phone,
      user_address: trimmedAddress || 'Не указан',
      payment_method: paymentMethod === 'card' ? 'Карта' : paymentMethod === 'cash' ? 'Наличные' : 'СБП',
      items_list: itemsList,
      total_price: `${getTotalPrice()} $`
    };
    
    // 5. НАДЁЖНАЯ ОТПРАВКА НАПРЯМУЮ С РАБОЧИМИ КЛЮЧАМИ
    const serviceId = 'service_2xllynb';
    const templateId = 'template_h8ep357';
    const publicKey  = 'd_rtQOMq280z3viDP';
    
    send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    )
      
      
      
      .then(() => {
        alert(`🎉 Спасибо за заказ, ${name || 'Покупатель'}!\nУведомление успешно отправлено на вашу почту.`);
        
        // Очистка полей и корзины
        setName('');
        setPhone('');
        setAddress('');
        clearCart();
      })
      .catch((error) => {
        console.error('Ошибка отправки EmailJS:', error);
        
        // Показываем РЕАЛЬНЫЙ текст ошибки из интернета, а не нашу старую заглушку
        const errorMessage = error?.text || error?.message || JSON.stringify(error);
        alert(`❌ Ошибка EmailJS: ${errorMessage}`);
      });
  };
  
  return (
    <div style={styles.checkoutContainer}>
      <h2 style={styles.title}>📋 Оформление заказа</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Ваше имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иван Иванов"
            style={styles.input}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Номер телефона *</label>
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+380 123-45-67 или любой другой"
            style={styles.input}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Адрес доставки или Email</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Новая Почта №5, г. Киев или client@mail.com"
            style={styles.input}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Способ оплаты</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={styles.select}
          >
            <option value="card">💳 Картой на сайте</option>
            <option value="cash">💵 При получении</option>
            <option value="sbp">📲 Электронный перевод / СБП</option>
          </select>
        </div>
        
        <div style={styles.summaryBox}>
          <span>Товаров в заказе: <strong>{items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)} шт.</strong></span>
          <span>К оплате: <strong style={{color: '#1e7e34'}}>{getTotalPrice()} \$</strong></span>
        </div>
        
        <button type="submit" style={styles.submitButton}>
          Подтвердить и заказать
        </button>
      </form>
    </div>
  );
};

const styles = {
  checkoutContainer: {
    backgroundColor: '#ffffff',
    border: '2px solid #cbd5e0',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  title: {
    fontSize: '22px',
    margin: '0 0 20px 0',
    color: '#1a202c',
    borderBottom: '3px solid #764ba2',
    paddingBottom: '8px',
    display: 'inline-block',
    fontWeight: 'bold' as const
  },
  form: {display: 'flex', flexDirection: 'column' as const, gap: '18px'},
  inputGroup: {display: 'flex', flexDirection: 'column' as const, gap: '8px'},
  label: {fontSize: '15px', fontWeight: 'bold' as const, color: '#2d3748'},
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid #a0aec0',
    fontSize: '15px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1a202c',
    width: '100%',
    boxSizing: 'border-box' as const,
    transition: 'all 0.15s ease-in-out'
  },
  select: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid #a0aec0',
    fontSize: '15px',
    outline: 'none',
    color: '#1a202c',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box' as const,
    transition: 'all 0.15s ease-in-out'
  },
  summaryBox: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#f7fafc',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '16px',
    color: '#2d3748',
    marginTop: '8px',
    border: '2px dashed #cbd5e0',
    fontWeight: '500' as const
  },
  submitButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '16px 0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    fontSize: '17px',
    boxShadow: '0 4px 12px rgba(118, 75, 162, 0.3)',
    transition: 'transform 0.1s ease'
  },
};
