import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 1. Описываем типы данных
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// 2. Описываем экшены для редьюсера
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// 3. Редьюсер для предсказуемого изменения состояния
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (exists) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    
    case 'REMOVE_ITEM':
      return { items: state.items.filter((item) => item.id !== action.payload) };
    
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return { items: [] };
    
    default:
      return state;
  }
};

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// 5. Провайдер с безопасной работой с localStorage
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    try {
      const localData = localStorage.getItem('react-shopping-cart');
      // Проверяем, что в localStorage лежит валидный массив
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) return { items: parsed };
      }
    } catch (e) {
      console.error("Ошибка чтения localStorage, кэш сброшен:", e);
    }
    return { items: [] };
  });
  
  // Сохраняем стейт в localStorage только при реальном изменении элементов
  useEffect(() => {
    localStorage.setItem('react-shopping-cart', JSON.stringify(state.items));
  }, [state.items]);
  
  // Добавляем console.log прямо в экшены для контроля кликов в консоли браузера (F12)
  const addItem = (product: Product) => {
    // console.log("Контекст: Добавление товара ->", product);
    dispatch({ type: 'ADD_ITEM', payload: product });
  };
  
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  
  const getTotalPrice = () => state.items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const getTotalItems = () => state.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  
  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
