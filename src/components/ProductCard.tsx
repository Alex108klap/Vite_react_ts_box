import React from 'react';
import { useCart } from 'src/context/CartContext';
import type { Product } from 'src/context/CartContext';

interface CardProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number; // Сюда приходит процент (например, 15)
}

interface ProductCardProps {
  product: CardProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  
  // Скидка активна, если передан процент от 1 до 100
  const hasDiscount = !!product.discount && product.discount > 0 && product.discount <= 100;
  
  // Рассчитываем новую цену с учётом процента скидки и округляем до целого числа
  const finalPrice = hasDiscount
    ? Math.round(product.price * (1 - product.discount! / 100))
    : product.price;
  
  const handleAddToCart = () => {
    const productForCart: Product = {
      id: product.id,
      name: product.name,
      price: finalPrice, // В корзину уходит правильная итоговая цена
      image: product.image,
    };
    
    addItem(productForCart);
  };
  
  return (
    <div className="product-card" style={styles.card}>
      <div className="product-card-image-wrap" style={{ position: 'relative', width: '100%', height: '205px' }}>
        <img src={product.image} alt={product.name} style={styles.image} />
        {hasDiscount && (
          <span style={styles.saleBadge}>-{product.discount}%</span>
        )}
      </div>
      
      <h3 className="product-card-title" style={styles.title}>{product.name}</h3>
      
      <div style={styles.priceContainer}>
        {hasDiscount ? (
          <>
            {/* Старая цена (исходная) */}
            <span style={styles.oldPrice}>{product.price} $</span>
            {/* Новая цена (после вычета процентов) */}
            <span style={styles.newPrice}>{finalPrice} $</span>
          </>
        ) : (
          <span className="product-card-price" style={styles.normalPrice}>Цена: <strong>{product.price} $</strong></span>
        )}
      </div>
      
      <button className="product-card-button" onClick={handleAddToCart} style={styles.button}>
        Добавить в корзину
      </button>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #e0e0e0', padding: '16px',
    borderRadius: '12px',
    textAlign: 'center' as const,
    width: '100%',
    maxWidth: '300px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    minHeight: '410px',
    position: 'relative' as const,
  },
  image: {
    width: '100%',
    height: '205px',
    objectFit: 'cover' as const,
    borderRadius: '8px'
  },
  saleBadge: {
    position: 'absolute' as const,
    top: '8px',
    left: '8px',
    backgroundColor: '#e53e3e',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 'bold',
    letterSpacing: '0.5px'
  },
  title: {
    fontSize: '19px',
    margin: '12px 0 6px 0',
    color: '#20242e'
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    margin: '0 0 12px 0',
    minHeight: '24px'
  },
  normalPrice: {
    color: '#292e3b',
    fontSize: '17px',
  },
  oldPrice: {
    color: '#4b5563',
    textDecoration: 'line-through',
    fontSize: '16px',
    fontWeight: '500' as const,
  },
  newPrice: {
    color: '#e53e3e',
    fontWeight: 'bold' as const,
    fontSize: '18px'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '13px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold' as const,
    fontSize: '16px'
  }
};
