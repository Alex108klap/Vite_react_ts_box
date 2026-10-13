import React from 'react';
import {
  // ChakraProvider,
  // defaultSystem, // В v3 конфигурация системы импортируется явно
  Card,
  Image,
  Heading,
  Text,
  Button,
  Container
} from '@chakra-ui/react';
import {Provider} from "@/components/ui/provider"

// 1. Интерфейс для типов данных товара
interface Product {
  name: string;
  price: number;
  img: string;
}

// 2. Mock-данные товара
const product: Product = {
  name: "Беспроводные наушники Premium",
  price: 99.99,
  img: "https://unsplash.com"
};

// 3. Компонент карточки товара в стиле Chakra UI v3
export const MyCard: React.FC = () => {
  return (
    // В v3 Card.Root заменяет Box с ручными границами для карточек
    <Card.Root maxW="sm" overflow="hidden"   bg="bg.mycard" color="fgMuted">
      
      <Image
        src={product.img}
        alt={product.name}
        objectFit="cover"
        height="200px" // Ограничиваем высоту для аккуратного вида
      />
      
      {/* Контентная часть теперь оборачивается в Card.Body */}
      <Card.Body gap="2">
        <Heading size="md">
          {product.name}
        </Heading>
        
        {/* В v3 fontWeight="bold" остается валидным */}
        <Text color="blue.600" fontSize="xl" fontWeight="bold">
          ${product.price}
        </Text>
      </Card.Body>
      
      {/* Кнопки действий выносятся в Card.Footer */}
      <Card.Footer>
        {/* Исправлено для v3: вместо colorScheme используется colorPalette */}
        <Button colorPalette="blue" width="full">
          В корзину
        </Button>
      </Card.Footer>
    
    </Card.Root>
  );
};

// 4. Корневой компонент приложения с новым провайдером v3
export default function App() {
  return (
    // В v3 необходимо передавать структуру system в провайдер
    <Provider >
      <Container maxW="container.md" py={8} centerContent>
        <MyCard />
      </Container>
    </Provider>
  );
}
