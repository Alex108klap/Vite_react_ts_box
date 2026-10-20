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
      {/* Внедряем динамический медиа-запрос для нижнего блока кнопок */}
      <style>{`
        @media (max-width: 550px) {
          .cart-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 15px;
          }
          .cart-footer-actions {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .cart-item-row {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            text-align: center;
            justify-items: center;
            padding: 15px 5px !important;
          }
        }
      `}</style>
      
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
              /* Заменили flex на адаптивный grid. На ПК это 4 колонки в ряд, на мобилках сработает класс .cart-item-row */
              <div
                key={item.id}
                className="cart-item-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  borderBottom: '1px solid #ccc',
                  color: '#333333'
                }}
              >
                {/* Название товара */}
                <span style={{ fontWeight: 'bold', color: '#111111', fontSize: '16px' }}>
                  {item.name}
                </span>
                
                {/* Кнопки количества */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '4px', border: '1px solid #999', padding: '2px 4px' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '4px 10px', color: '#000', background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                  <span style={{ margin: '0 8px', fontWeight: 'bold', color: '#000000', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '4px 10px', color: '#000', background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                </div>
                
                {/* Стоимость позиции */}
                <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap' }}>
                  {item.price * item.quantity} \$
                </span>
                
                {/* Кнопка удаления */}
                <button onClick={() => removeItem(item.id)} style={{ color: '#dc3545', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '14px', padding: '5px' }}>
                  Удалить
                </button>
              </div>
            ))}
          </div>
          
          {/* Нижняя панель с кнопками сброса и оформления */}
          <div className="cart-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #ccc', paddingTop: '15px' }}>
            <h3 style={{ color: '#222222', margin: 0 }}>
              Итого: <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '22px' }}>{getTotalPrice()} \$</span>
            </h3>
            
            <div className="cart-footer-actions">
              <button onClick={clearCart} style={{ marginRight: '10px', padding: '10px 14px', cursor: 'pointer', color: '#333', background: '#eee', border: '1px solid #aaa', borderRadius: '4px', fontWeight: '500' }}>
                Очистить корзину
              </button>
              <button
                onClick={handleScrollToCheckout}
                style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
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
