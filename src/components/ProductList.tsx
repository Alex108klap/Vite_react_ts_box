import React, { useEffect, useMemo, useState } from 'react';
import { sanityClient } from 'src/sanityClient';
import { ProductCard } from './ProductCard';

interface SanityCategory {
  title: string;
  slug?: {
    current: string;
  };
}

interface SanityProduct {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: SanityCategory;
  image: string;
  discount?: number;
}

interface CategoryOption {
  id: string;
  title: string;
  count: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  __all_products__: '🛍️',
  audio: '🎧',
  peripherals: '⌨️',
  gadgets: '⌚',
  games: '🎮',
};
const ALL_PRODUCTS_CATEGORY_ID = '__all_products__';

const formatProductCount = (count: number) => {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  const noun = lastTwoDigits >= 11 && lastTwoDigits <= 14
    ? 'товаров'
    : lastDigit === 1
      ? 'товар'
      : lastDigit >= 2 && lastDigit <= 4
        ? 'товара'
        : 'товаров';

  return `${count} ${noun}`;
};

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<SanityProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    sanityClient
      .fetch<SanityProduct[]>(`*[_type == "product"] {
        _id,
        name,
        price,
        description,
        category-> {
          title,
          slug { current }
        },
        "image": image.asset->url,
        discount
      }`, {}, { useCdn: false })
      .then((data) => setProducts(data || []))
      .catch((err) => {
        console.error('Ошибка загрузки товаров:', err);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo<CategoryOption[]>(() => {
    const categoryMap = new Map<string, CategoryOption>();

    products.forEach((product) => {
      const title = product.category?.title?.trim();
      const id = product.category?.slug?.current;
      if (!title || !id) return;

      const existing = categoryMap.get(id);

      if (existing) existing.count += 1;
      else categoryMap.set(id, { id, title, count: 1 });
    });

    return [
      { id: ALL_PRODUCTS_CATEGORY_ID, title: 'Все товары', count: products.length },
      ...Array.from(categoryMap.values()),
    ];
  }, [products]);

  const selectedCategory = categories.find((category) => category.id === activeCategory);
  const filteredProducts = products.filter((product) => {
    const productCategory = product.category?.slug?.current;
    const matchesCategory = activeCategory === ALL_PRODUCTS_CATEGORY_ID || productCategory === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!activeCategory) {
    return (
      <section className="store-catalog" aria-labelledby="category-heading">
        <div className="category-intro">
          <p className="category-eyebrow">ТЕХНО-МАРКЕТ · КАТАЛОГ</p>
          <h2 id="category-heading">Выберите категорию</h2>
          <p>Найдите нужные товары в нашем магазине</p>
        </div>

        {loading ? (
          <div className="catalog-message" role="status">Загружаем категории и товары…</div>
        ) : loadError ? (
          <div className="catalog-message" role="alert">Не удалось загрузить каталог. Попробуйте обновить страницу.</div>
        ) : categories.length === 0 ? (
          <div className="catalog-message">Пока в магазине нет категорий с товарами.</div>
        ) : (
          <div className="category-grid">
            {categories.map((category, index) => (
              <button
                className="category-card"
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveCategory(category.id);
                  setSearchQuery('');
                }}
              >
                <span className={`category-icon category-icon-${index % 4}`} aria-hidden="true">
                  {CATEGORY_ICONS[category.id] || '✦'}
                </span>
                <span className="category-card-copy">
                  <span className="category-card-title">{category.title}</span>
                  <span className="category-card-count">{formatProductCount(category.count)}</span>
                </span>
                <span className="category-card-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="store-catalog" aria-labelledby="products-heading">
      <div className="products-toolbar">
        <button className="back-to-categories" type="button" onClick={() => setActiveCategory(null)}>
          <span aria-hidden="true">←</span> Все категории
        </button>
        <div className="products-heading-wrap">
          <h2 id="products-heading">{selectedCategory?.title || 'Товары'}</h2>
          <p>{formatProductCount(filteredProducts.length)}</p>
        </div>
        <input
          className="product-search"
          type="search"
          placeholder="Поиск в категории…"
          aria-label="Поиск товаров в категории"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {loading ? (
        <div className="catalog-message" role="status">Загружаем товары…</div>
      ) : filteredProducts.length === 0 ? (
        <div className="catalog-message">По вашему запросу товары не найдены.</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.image || 'https://placeholder.com',
                discount: product.discount,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};
