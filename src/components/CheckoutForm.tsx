import React, { useState } from 'react';
import { useCart } from 'src/context/CartContext';
import type { CartItem } from 'src/context/CartContext';
// 1. ИМПОРТИРУЕМ ОФИЦИАЛЬНЫЙ МЕТОД EMAILJS
import { send } from '@emailjs/browser';

export const CheckoutForm: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // ИСПРАВЛЕНО: Заменили FormEvent на BaseSyntheticEvent для устранения ворнинга TS6385
  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Ваша корзина пуста! Добавьте товары перед оформлением заказа.');
      return;
    }
    
    if (!phone.trim()) {
      alert('Пожалуйста, введите ваш номер телефона.');
      return;
    }
    
    // Контроль номера телефона
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
    
    // Умный контроль адреса / email
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
    
    // Формирование списка товаров
    const itemsList = items
      .map((item: CartItem) => `- ${item.name} x ${item.quantity} шт. (${item.price * item.quantity} $)`)
      .join('\n');
    
    // Ключи EmailJS теперь берутся из безопасных переменных окружения Vite
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    const templateParams = {
      to_email: 'kunica108@gmail.com',
      user_name: name || 'Не указано',
      user_phone: phone,
      user_address: trimmedAddress || 'Не указан',
      payment_method: paymentMethod === 'card' ? 'Карта' : paymentMethod === 'cash' ? 'Наличные' : 'СБП',
      items_list: itemsList,
      total_price: `${getTotalPrice()} $`
    };
    
    
    // 2. ИСПОЛЬЗУЕМ ОФИЦИАЛЬНУЮ ФУНКЦИЮ SEND, КОТОРАЯ ОБХОДИТ БЛОКИРОВКИ БРАУЗЕРА
    send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert(`🎉 Уведомление успешно отправлено на вашу почту!`);
        
        setName('');
        setPhone('');
        setAddress('');
        clearCart();
      })
      .catch((error) => {
        console.error('FAILED...', error);
        alert('Произошла ошибка при отправке через EmailJS. Проверьте конфигурацию сервиса.');
      });
  };
  
  return (
    <div style={styles.checkoutContainer}>
      {/* ПРИНУДИТЕЛЬНЫЙ СБРОС ТЕМЫ НА СВЕТЛУЮ ДЛЯ ВСЕХ ПОЛЕЙ ВНУТРИ ДАННОЙ ФОРМЫ */}
      <style>{`
        .force-light-form input,
        .force-light-form select {
          background-color: #ffffff !important;
          color: #000000 !important;
          color-scheme: light !important;
        }
        .force-light-form input:-webkit-autofill,
        .force-light-form input:-webkit-autofill:hover,
        .force-light-form input:-webkit-autofill:focus {
          -webkit-text-fill-color: #000000 !important;
          box-shadow: 0 0 0px 1000px #ffffff inset !important;
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
      `}</style>
      
      <h2 style={styles.title}>📋 Оформление заказа</h2>
      
      <form onSubmit={handleSubmit} style={styles.form} className="force-light-form">
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
        
        {/* Поле: Адрес или Email */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Адрес доставки или Email</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Новая Почта №5, г.Харьков или client@mail.com"
            disabled={false}
            readOnly={false}
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
        
        {/* Информационный блок */}
        <div style={styles.summaryBox}>
          <div style={styles.summaryItem}>
            <span>Товаров в заказе:</span>
            <strong>{items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)} шт.</strong>
          </div>
          <div style={styles.summaryItem}>
            <span>К оплате:</span>
            <strong style={{color: '#28a745', fontSize: '22px'}}>{getTotalPrice()} $</strong>
          </div>
        </div>
        
        <button type="submit" style={styles.submitButton}>
          Подтвердить и заказать
        </button>
      </form>
    </div>
  );
};

// ВОССТАНОВЛЕННЫЙ ОБЪЕКТ СТИЛЕЙ БЕЗ ОБРЫВОВ
const styles = {
  checkoutContainer: {
    backgroundColor: '#ffffff',
    border: '2px solid #a0aec0',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  title: {
    fontSize: '24px',
    margin: '0 0 24px 0',
    color: '#1a202c',
    borderBottom: '3px solid #764ba2',
    paddingBottom: '8px',
    display: 'inline-block',
    fontWeight: 'bold' as const
  },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  label: {
    fontSize: '17px',
    fontWeight: 'bold' as const,
    color: '#1a202c'
  },
  input: {
    padding: '16px 20px',
    borderRadius: '8px',
    border: '2px solid #1a202c',
    fontSize: '20px',
    fontWeight: 'bold' as const,
    outline: 'none',
    color: '#000000',
    backgroundColor: '#ffffff',
    colorScheme: 'light',
    transition: 'all 0.15s ease-in-out',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  select: {
    padding: '16px 20px',
    borderRadius: '8px',
    border: '2px solid #1a202c',
    fontSize: '20px',
    fontWeight: 'bold' as const,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    backgroundColor: '#ffffff',
    color: '#000000',
    colorScheme: 'light',
    WebkitAppearance: 'none' as const
  },
  summaryBox: {
    backgroundColor: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    color: '#4a5568'
  },
  submitButton: {
    backgroundColor: '#764ba2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '18px 20px',
    fontSize: '20px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    width: '100%',
    boxSizing: 'border-box' as const,
    boxShadow: '0 4px 12px rgba(118, 75, 162, 0.3)'
  }
};
