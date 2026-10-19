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
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    
    // Ключи EmailJS
    const serviceId = 'service_2xllynb';
    const templateId = 'template_h8ep357';
    const publicKey  = 'd_rtQOMq280z3viDP';
    
    const templateParams = {
      to_email: 'kunica108@gmail.com',
      customer_name: name || 'Не указано',
      customer_phone: phone,
      customer_address: trimmedAddress || 'Не указан',
      payment_method: paymentMethod === 'card' ? 'Карта' : paymentMethod === 'cash' ? 'Наличные' : 'СБП',
      items_ordered: itemsList,
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
        
        {/* Поле: Адрес или Email */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Адрес доставки или Email</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Новая Почта №5, г.Харьков или client@mail.com"
            // Принудительно разрешаем редактирование, сбрасываем стили автозаполнения браузера
            disabled={false}
            readOnly={false}
            style={{
              ...styles.input,
              backgroundColor: '#ffffff',
              WebkitTextFillColor: '#000000', // Делает текст черным в Chrome/Safari
              color: '#000000'
            }}
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
    border: '2px solid #a0aec0', // Сделали рамку контейнера чуть заметнее
    borderRadius: '12px',
    padding: '24px',
    marginTop: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  title: {
    fontSize: '24px', // Увеличили заголовок
    margin: '0 0 24px 0',
    color: '#1a202c',
    borderBottom: '3px solid #764ba2',
    paddingBottom: '8px',
    display: 'inline-block',
    fontWeight: 'bold' as const
  },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '20px' }, // Чуть увеличили отступы между полями
  inputGroup: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  label: {
    fontSize: '17px', // Увеличили подписи полей (было 15px)
    fontWeight: 'bold' as const,
    color: '#1a202c' // Сделали цвет подписей максимально темным и контрастным
  },
  input: {
    padding: '16px 20px',        // Оставляем просторные отступы
    borderRadius: '8px',
    border: '2px solid #1a202c',   // Чёткая тёмная рамка
    fontSize: '20px',            // Крупный размер шрифта
    fontWeight: 'bold' as const,   // Жирный шрифт для максимальной чёткости
    outline: 'none',
    color: '#000000',            // Угольно-чёрный цвет текста
    transition: 'all 0.15s ease-in-out',
    width: '100%',
    boxSizing: 'border-box' as const,
    
    // ЭТОТ ТРЮК УБИРАЕТ СЕРЫЙ ЦВЕТ АВТОЗАПОЛНЕНИЯ БРАУЗЕРА:
    // Мы принудительно заливаем внутреннюю тень белым цветом
    boxShadow: '0 0 0px 1000px #ffffff inset',
    WebkitBoxShadow: '0 0 0px 1000px #ffffff inset',
  },
  
  select: {
    padding: '16px 20px',      // Выравниваем выпадающий список по размеру с полями
    borderRadius: '8px',
    border: '2px solid #1a202c',
    fontSize: '20px',          // Увеличили размер шрифта в выпадающем списке
    fontWeight: 'bold' as const, // Сделали текст выбора жирным
    outline: 'none',
    color: '#000000',          // Сделали текст выбора абсолютно чёрным
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  
  summaryBox: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#f7fafc',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '18px', // Увеличили блок с итоговой суммой
    color: '#1a202c',
    marginTop: '8px',
    border: '2px dashed #718096',
    fontWeight: 'bold' as const // Сделали весь текст в инфо-боксе жирным
  },
  submitButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '18px 0', // Сделали кнопку заказа еще массивнее и солиднее
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    fontSize: '19px', // Увеличили шрифт на кнопке
    boxShadow: '0 4px 12px rgba(118, 75, 162, 0.3)',
    transition: 'transform 0.1s ease',
    width: '100%'
  },
};

