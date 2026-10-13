
// Импортируем провайдер корзины
import { CartProvider } from 'src/context/CartContext';
import { MainPage} from 'src/pages/MainPage';

export const App = () => {
  return (
    <CartProvider>
      <>
      < MainPage />
      </>
    </CartProvider>
  );
}

