import React, {useState, useEffect} from 'react';
import {sanityClient} from 'src/sanityClient';
import type {Product} from 'src/context/CartContext';
import {ProductCard} from './ProductCard';

// Адаптируем типы под новую структуру данных Sanity, где image — готовая строка-URL
interface SanityProduct extends Omit<Product, 'id' | 'image'> {
  _id: string;
  category: 'all' | 'audio' | 'peripherals' | 'gadgets';
  image: string; // Из GROQ-запроса возвращается чистая строка
}

const CATEGORIES = [
  {id: 'all', label: '📋 Все товары'},
  {id: 'audio', label: '🎵 Аудио'},
  {id: 'peripherals', label: '💻 Периферия'},
  {id: 'gadgets', label: '⚙️ Гаджеты'},
] as const;

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<SanityProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // Для безопасной гидратации React
  
  const [activeCategory, setActiveCategory] = useState<'all' | 'audio' | 'peripherals' | 'gadgets'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    setIsMounted(true); // Флаг того, что клиентский компонент успешно смонтирован
    
    sanityClient
      .fetch(`*[_type == "product"] {
    _id,
    name,
    price,
    description,
    category-> {
      title,
      slug { current }
    },
    "image": image.asset->url
  }`)
      .then((data: SanityProduct[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке товаров:", err);
        setLoading(false);
      });
  }, []);
  
  const matchesCategory = activeCategory === 'all' || (product as any).category?.slug?.current === activeCategory;
  const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesCategory && matchesSearch;
}
)
;

// Защита от Hydration Mismatch: не рендерим динамический контент до полного монтирования в браузере
if (!isMounted) {
  return <div style={styles.loadingBox}>🔄 Инициализация витрины...</div>;
}

return (
  <div style={styles.container}>
    
    {/* Панель поиска */}
    <div style={styles.searchContainer}>
      <input
        type="text"
        placeholder="🔍 Поиск гаджетов по названию..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchInput}
      />
    </div>
    
    {/* Панель категорий */}
    <div style={styles.filterBar}>
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setSearchQuery('');
            }}
            style={{
              ...styles.filterButton,
              backgroundColor: isActive ? '#667eea' : '#fff',
              color: isActive ? '#fff' : '#555',
              border: isActive ? '1px solid #667eea' : '1px solid #e1e4e8',
              boxShadow: isActive ? '0 4px 10px rgba(102, 126, 234, 0.2)' : 'none',
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
    
    {/* Обработка индикатора загрузки и пустых результатов */}
    {loading ? (
      <div style={styles.loadingBox}>
        🔄 Синхронизация с базой данных ТЕХНО-МАРКЕТ...
      </div>
    ) : filteredProducts.length === 0 ? (
      <div style={styles.notFound}>
        😢 К сожалению, ничего не найдено по запросу «{searchQuery}»
      </div>
    ) : (
      /* Адаптивная сетка товаров */
      <div style={styles.grid}>
        {filteredProducts.map((product) => {
          const standardProduct: Product = {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image || 'placeholder.png', // Безопасно подставляем строку-ссылку
          };
          return <ProductCard key={product._id} product={standardProduct}/>;
        })}
      </div>
    )}
  </div>
);
}
;

const styles = {
  container: {
    padding: '0px',
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    width: '100%',
  },
  loadingBox: {
    textAlign: 'center' as const,
    padding: '60px 0',
    fontSize: '18px',
    fontFamily: 'sans-serif',
    color: '#4a5568',
    fontWeight: 'bold'
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
    width: '100%',
  },
  searchInput: {
    width: '100%',
    maxWidth: '500px',
    padding: '12px 20px',
    borderRadius: '30px',
    backgroundColor: '#ffffff',
    color: '#333333',
    border: '1px solid #dcdfe6',
    fontSize: '15px',
    outline: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
  },
  filterBar: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
    marginBottom: '30px',
    width: '100%',
  },
  filterButton: {
    padding: '10px 20px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  grid: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    width: '100%',
  },
  notFound: {
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '16px',
    padding: '40px 0',
    fontStyle: 'italic',
  }
};