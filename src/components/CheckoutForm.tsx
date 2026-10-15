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
  
  // Кастомный перехватчик для ярких плейсхолдеров
  const [isNameActive, setIsNameActive] = useState(false);
  const [isPhoneActive, setIsPhoneActive] = useState(false);
  const [isAddressActive, setIsAddressActive] = useState(false);
  
  const namePlaceholder = "Иван Иванов";
  const phonePlaceholder = "+7 (999) 123-45-67";
  const addressPlaceholder = "г. Москва, ул. Ленина, д. 10, кв. 5";
  
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
        
        {/* Контейнер-строка: объединяет Имя и Телефон для экономии места на ПК */}
        <div style={styles.row}>
          <div style={styles.inputGroupFlex}>
            <label style={styles.label}>Ваше имя</label>
            <input
              type="text"
              required
              value={isNameActive || name ? name : namePlaceholder}
              onChange={(e) => { if (isNameActive) setName(e.target.value); }}
              onFocus={() => setIsNameActive(true)}
              onBlur={() => setIsNameActive(false)}
              style={{
                ...styles.input,
                color: isNameActive || name ? '#111111' : '#555555',
                fontWeight: isNameActive || name ? 'normal' : 'bold',
                borderColor: isNameActive ? '#764ba2' : '#4a5568'
              }}
            />
          </div>
          
          <div style={styles.inputGroupFlex}>
            <label style={styles.label}>Номер телефона *</label>
            <input
              type="tel"
              required
              value={isPhoneActive || phone ? phone : phonePlaceholder}
              onChange={(e) => { if (isPhoneActive) setPhone(formatPhoneNumber(e.target.value)); }}
              onFocus={() => setIsPhoneActive(true)}
              onBlur={() => setIsPhoneActive(false)}
              style={{
                ...styles.input,
                color: isPhoneActive || phone ? '#111111' : '#555555',
                fontWeight: isPhoneActive || phone ? 'normal' : 'bold',
                borderColor: isPhoneActive ? '#764ba2' : '#4a5568'
              }}
            />
          </div>
        </div>
        
        {/* Поле: Адрес доставки */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Адрес доставки или Email</label>
          <input
            type="text"
            required
            value={isAddressActive || address ? address : addressPlaceholder}
            onChange={(e) => { if (isAddressActive) setAddress(e.target.value); }}
            onFocus={() => setIsAddressActive(true)}
            onBlur={() => setIsAddressActive(false)}
            style={{
              ...styles.input,
              color: isAddressActive || address ? '#111111' : '#555555',
              fontWeight: isAddressActive || address ? 'normal' : 'bold',
              borderColor: isAddressActive ? '#764ba2' : '#4a5568'
            }}
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
    border: '2px solid #2d3748', // Очень контрастная темная рамка блока
    borderRadius: '10px',
    padding: '16px 20px', // Уменьшили внутренние отступы для компактности
    marginTop: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  title: {
    fontSize: '18px', // Сделали заголовок чуть компактнее
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
    gap: '12px', // Уменьшили расстояние между элементами с 18px до 12px
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap' as const, // Автоперенос на телефонах
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
    flex: '1 1 200px', // Растягиваются в строку на ПК, падают вниз на мобильных
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#111111', // Абсолютно черный, максимально читаемый текст меток
  },
  input: {
    padding: '10px 14px', // Компактные поля ввода
    borderRadius: '6px',
    border: '2px solid', // Контрастная толстая рамка
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box' as const,
    width: '100%',
    transition: 'border-color 0.15s ease-in-out',
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
    padding: '10px 14px', // Более сжатая плашка итогов
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
    padding: '12px 0', // Уменьшили высоту кнопки
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    fontSize: '16px',
    boxShadow: '0 4px 10px rgba(118, 75, 162, 0.2)',
  },
};
