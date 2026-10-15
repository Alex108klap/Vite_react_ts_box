import React, { useState } from 'react';
import { useCart } from 'src/context/CartContext';
import type { CartItem } from 'src/context/CartContext';
import { send } from '@emailjs/browser';

export const CheckoutForm: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  
  // Чистые начальные состояния — никаких скрытых подмен текста
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Умная функция маски номера телефона, которая теперь работает идеально
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength === 0) return '';
    
    const prefix = '+7';
    let digits = phoneNumber;
    
    if (phoneNumber.startsWith('7') || phoneNumber.startsWith('8')) {
      digits = phoneNumber.substring(1);
    }
    
    if (phoneNumberLength <= 1 && (phoneNumber.startsWith('7') || phoneNumber.startsWith('8'))) {
      return '+7 ';
    }
    if (digits.length <= 3) return `${prefix} (${digits}`;
    if (digits.length <= 6) return `${prefix} (${digits.slice(0, 3)}) ${digits.slice(3)}`;
    if (digits.length <= 8) return `${prefix} (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    return `${prefix} (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Передаем в маску чистый ввод пользователя
    setPhone(formatPhoneNumber(e.target.value));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Ваша корзина пуста! Добавьте товары перед оформлением заказа.');
      return;
    }
    if (phone.length < 18) {
      alert('Пожалуйста, введите корректный номер телефона целиком.');
      return;
    }
    
    const templateParams = {
      to_name: "Администратор магазина",
      user_name: name || 'Не указано',
      user_phone: phone,
      user_address: address || 'Не указан',
      payment_method: paymentMethod === 'card' ? 'Карта' : paymentMethod === 'cash' ? 'Наличные' : 'СБП',
      items_list: items.map((item: CartItem) => `• ${item.name} x ${item.quantity} шт.`).join('\n'),
      total_price: `${getTotalPrice()} $`
    };
    
    send('service_2xllynb', 'template_h8ep357', templateParams, 'd_rtQOMq280z3viDP')
      .then(() => {
        alert(`🎉 Спасибо за заказ, ${name || 'Покупатель'}!\nУведомление успешно отправлено на вашу почту.`);
        setName('');
        setPhone('');
        setAddress('');
        clearCart();
      })
      .catch((error) => {
        alert(`❌ Ошибка EmailJS: ${error?.text || error?.message || 'Неизвестная ошибка'}`);
      });
  };
  
  return (
    <div style={styles.checkoutContainer}>
      <h2 style={styles.title}>📋 Быстрое оформление</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* Строка: Имя и Телефон */}
        <div style={styles.row}>
          <div style={styles.inputGroupFlex}>
            <label style={styles.label}>Ваше имя</label>
            <input
              type="text"
              required
              placeholder="Иван Иванов"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroupFlex}>
            <label style={styles.label}>Номер телефона *</label>
            <input
              type="tel"
              required
              placeholder="+7 (999) 123-45-67"
              value={phone}
              onChange={handlePhoneChange}
              style={styles.input}
            />
          </div>
        </div>
        
        {/* Поле: Адрес доставки */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Адрес доставки или Email</label>
          <input
            type="text"
            required
            placeholder="г. Москва, ул. Ленина, д. 10, кв. 5"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.input}
          />
        </div>
        
        {/* Поле: Способ оплаты */}
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
        
        {/* Компактная плашка с ценой */}
        <div style={styles.summaryBox}>
          <span>Всего: <strong>{items.reduce((sum, item) => sum + item.quantity, 0)} шт.</strong></span>
          <span>К оплате: <strong style={{ color: '#1e7e34', fontSize: '18px' }}>{getTotalPrice()} \$</strong></span>
        </div>
        
        <button type="submit" style={styles.submitButton}>
          Подтвердить заказ
        </button>
      </form>
    </div>
  );
};

const styles = {
  checkoutContainer: {
    backgroundColor: '#ffffff',
    border: '2px solid #2d3748',
    borderRadius: '10px',
    padding: '16px 20px',
    marginTop: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  title: {
    fontSize: '18px',
    margin: '0 0 14px 0',
    color: '#111111',
    borderBottom: '3px solid #764ba2',
    paddingBottom: '4px',
    display: 'inline-block',
    fontWeight: 'bold' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap' as const,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    width: '100%',
  },
  inputGroupFlex: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    flex: '1 1 200px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#111111',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '2px solid #4a5568', // Четкая, контрастная рамка по умолчанию
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#111111',
    boxSizing: 'border-box' as const,
    width: '100%',
  },
  select: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '2px solid #4a5568',
    fontSize: '14px',
    outline: 'none',
    color: '#111111',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    boxSizing: 'border-box' as const,
    width: '100%',
  },
  summaryBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '15px',
    color: '#111111',
    marginTop: '4px',
    border: '2px dashed #cbd5e0',
    fontWeight: 'bold' as const,
  },
  submitButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '12px 0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    fontSize: '16px',
    boxShadow: '0 4px 10px rgba(118, 75, 162, 0.2)',
  },
};
