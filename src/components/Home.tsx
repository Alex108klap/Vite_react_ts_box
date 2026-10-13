// ==========================================
// СТРАНИЦЫ ПРИЛОЖЕНИЯ
// ==========================================
import { useOutletContext, useNavigate } from "react-router-dom"; // Объединил импорты в одну строку
import { Button, Heading, Text, VStack } from "@chakra-ui/react";

export const Home = () => {
  const navigate = useNavigate(); // Хук для программного перехода без клика по ссылке
  
  // 1. Вставляем получение данных из контекста Layout здесь:
  const { user } = useOutletContext<{ user: { name: string; id: string } | null }>();
  
  return (
    <VStack align="start" gap={4}>
      {/* 2. Используем данные пользователя для динамического приветствия */}
      <Heading size="2xl">
        Привет, {user ? user.name : "Гость"}!
      </Heading>
      
      <Text>Добро пожаловать! Этот текст меняется, пока шапка сайта сверху остается на месте.</Text>
      
      <Button colorPalette="blue" onClick={() => navigate("/about")}>
        Перейти на страницу "О нас" через хук
      </Button>
    </VStack>
  );
};