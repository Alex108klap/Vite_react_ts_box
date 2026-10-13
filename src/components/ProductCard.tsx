import React from 'react';
import { useCart } from 'src/context/CartContext';
import type { Product } from 'src/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  
  return (
    <div style={styles.card}>
      {/* Отображаем картинку */}
      <img src={product.image} alt={product.name} style={styles.image} />
      {/* Отображаем название */}
      <h3 style={styles.title}>{product.name}</h3>
      {/* Отображаем цену */}
      <p style={styles.price}>Цена: <strong>{product.price} $</strong></p>
      {/* Кнопка действия */}
      <button onClick={() => addItem(product)} style={styles.button}>
        Добавить в корзину
      </button>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #e0e0e0',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center' as const,
    width: '220px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    minHeight: '340px', // Подберите высоту под размер ваших картинок
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover' as const,
    borderRadius: '8px'
  },
  title: {
    fontSize: '16px',
    margin: '12px 0 6px 0',
    color: '#333'
  },
  price: {
    color: '#666',
    margin: '0 0 12px 0'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold' as const
  }
};
