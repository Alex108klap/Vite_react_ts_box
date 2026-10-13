import React from 'react';
import { useCart } from 'src/context/CartContext';
import { IoCartOutline } from 'react-icons/io5';

export const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  
  // Функция плавного скролла к форме заказа в самый низ страницы
  const handleScrollToCheckout = () => {
    window.scrollTo({
      top: document.body.scrollHeight, // Прокручивает страницу на всю её высоту
      behavior: 'smooth'               // Делает прокрутку красивой и плавной
    });
  };
  
  return (
    <div style={{ padding: '20px', background: '#d9d0d0', marginTop: '30px', borderRadius: '8px', border: '1px solid #ccc', color: '#333333' }}>
      <h2 style={{ color: '#222222', marginBottom: '20px' }}>Ваша Корзина ({getTotalItems()} шт.)</h2>
      
      {items.length === 0 ? (
        <p style={{ color: '#000033', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          Ваша корзина пока пуста
          <IoCartOutline style={{ color: '#a95409', fontSize: '30px' }} />
        </p>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', alignItems: 'center', color: '#333333' }}>
                <span style={{ fontWeight: 'bold', color: '#111111', minWidth: '180px' }}>{item.name}</span>
                
                <div style={{ color: '#333333' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '2px 8px', color: '#000' }}>-</button>
                  <span style={{ margin: '0 10px', fontWeight: 'bold', color: '#000000' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '2px 8px', color: '#000' }}>+</button>
                </div>
                
                <span style={{ color: '#333333', fontWeight: '500' }}>{item.price * item.quantity} $</span>
                
                <button onClick={() => removeItem(item.id)} style={{ color: '#dc3545', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 'bold' }}>Удалить</button>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #eee', paddingTop: '15px' }}>
            <h3 style={{ color: '#222222' }}>Итого: <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '20px' }}>{getTotalPrice()} $</span></h3>
            <div>
              <button onClick={clearCart} style={{ marginRight: '10px', padding: '8px 14px', cursor: 'pointer', color: '#333' }}>Очистить корзину</button>
              {/* Заменили alert на функцию handleScrollToCheckout */}
              <button
                onClick={handleScrollToCheckout}
                style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Оформить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
