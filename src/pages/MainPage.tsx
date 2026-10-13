import React from 'react';
// Импортируем каталог товаров
import { ProductList } from 'src/components/ProductList';
// Импортируем корзину
import { Cart } from 'src/components/Cart';
// Импортируем нашу новую форму
import { CheckoutForm } from 'src/components/CheckoutForm';
// Импортируем хук корзины
import { useCart } from 'src/context/CartContext';

// ==========================================
// ЧАСТЬ 1: Вынесенный компонент шапки магазина
// ==========================================
const Header: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  
  return (
    <header style={styles.header}>
      {/* Декоративный светящийся элемент */}
      <div style={styles.glow} />
      
      <h1 style={styles.logo}>
        ⚡ ТЕХНО-МАРКЕТ
        <span style={styles.badge}>
          🛒 {totalItems > 0 ? `В корзине: ${totalItems} шт.` : 'Корзина пуста'}
        </span>
      </h1>
      
      <p style={styles.promo}>
        Премиум гаджеты и умные аксессуары • <span style={styles.boldText}>Бесплатная доставка от 50 \$</span>
      </p>
    </header>
  );
};

// ==========================================
// ЧАСТЬ 2: Главный компонент страницы
// ==========================================
export const MainPage: React.FC = () => {
  return (
    <div style={styles.page}>
      {/* Рендерим вынесенную шапку */}
      <Header />
      
      {/* Главная контентная зона */}
      <main style={styles.main}>
        <ProductList />
        <Cart />
        <CheckoutForm />
      </main>
    </div>
  );
};

// Глобальные стили для обеих частей компонента
const styles = {
  page: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    padding: '20px',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '24px 20px',
    textAlign: 'center' as const,
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 4px 15px rgba(118, 75, 162, 0.3)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  glow: {
    position: 'absolute' as const,
    top: '-50%',
    left: '-10%',
    width: '300px',
    height: '300px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    pointerEvents: 'none' as const,
  },
  logo: {
    margin: '0 0 8px 0',
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  badge: {
    marginLeft: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '18px',
    verticalAlign: 'middle',
    display: 'inline-block',
  },
  promo: {
    margin: 0,
    fontSize: '14px',
    color: '#e0d5f5',
    fontWeight: '500',
  },
  boldText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
};
