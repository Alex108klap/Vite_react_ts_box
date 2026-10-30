import React, { useState } from 'react';
import { useCart } from 'src/context/CartContext';

export const CheckoutForm: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (items.length === 0) {
      alert('Ваша корзина пуста! Добавьте товары перед оформлением заказа.');
      return;
    }

    const normalizedPhone = phone.trim();
    const allowedChars = '0123456789 +-()';
    if ([...normalizedPhone].some((character) => !allowedChars.includes(character))) {
      alert('Номер телефона может содержать только цифры и знаки (+, -, пробелы, скобки).');
      return;
    }

    const digitsOnly = normalizedPhone.replace(/\D/g, '');
    if (digitsOnly.length < 9 || digitsOnly.length > 15) {
      alert('Пожалуйста, введите корректный номер телефона (от 9 до 15 цифр).');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const orderPayload = {
      name: name.trim(),
      phone: normalizedPhone,
      address: address.trim(),
      customerEmail: customerEmail.trim(),
      paymentMethod,
      items: items.map(({ id, quantity }) => ({ id, quantity })),
      website: String(formData.get('website') ?? ''),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (result.error === 'Order email service is not configured.') {
          alert('Сервер EmailJS не настроен. Проверьте переменные окружения сервера.');
        } else {
          alert('Не удалось отправить заказ. Проверьте соединение и попробуйте ещё раз.');
        }
        return;
      }

      setName('');
      setPhone('');
      setAddress('');
      setCustomerEmail('');
      clearCart();

      if (orderPayload.customerEmail && result.confirmationEmailSent) {
        alert(`🎉 Заказ принят! Подтверждение отправлено на ${orderPayload.customerEmail}.`);
      } else if (orderPayload.customerEmail) {
        alert('Заказ принят администратором, но письмо с подтверждением не удалось отправить.');
      } else {
        alert('🎉 Заказ принят! Уведомление отправлено администратору.');
      }
    } catch (error: unknown) {
      console.error('Ошибка отправки заказа:', error);
      alert('Не удалось отправить заказ. Проверьте соединение и попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
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
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}
        />
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
          <label htmlFor="customer-email" style={styles.label}>Email для подтверждения (необязательно)</label>
          <input
            id="customer-email"
            type="email"
            autoComplete="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="you@example.com"
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
            <strong>{items.reduce((sum, item) => sum + item.quantity, 0)} шт.</strong>
          </div>
          <div style={styles.summaryItem}>
            <span>К оплате:</span>
            <strong style={{color: '#28a745', fontSize: '22px'}}>{getTotalPrice()} $</strong>
          </div>
        </div>
        
        <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
          {isSubmitting ? 'Отправляем...' : 'Подтвердить и заказать'}
        </button>
      </form>
    </div>
  );
};

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
    boxSizing: 'border-box' as const,
    width: '100%'
  },
  select: {
    padding: '16px 20px',
    borderRadius: '8px',
    border: '2px solid #1a202c',
    fontSize: '18px',
    fontWeight: 'bold' as const,
    backgroundColor: '#ffffff',
    boxSizing: 'border-box' as const,
    width: '100%'
  },
  summaryBox: {
    backgroundColor: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
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
    padding: '18px',
    fontSize: '20px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    width: '100%',
    boxSizing: 'border-box' as const
  }
};
