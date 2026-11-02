
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import { Provider as ChakraProvider } from './components/ui/provider'; // Путь зависит от вашей настройки Chakra v3
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  
    <ChakraProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ChakraProvider>
  
);
