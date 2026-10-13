// src/pages/Pages.tsx
import { Heading, Text, VStack } from "@chakra-ui/react";

// Компонент для главной страницы
export const Home = () => {
  return (
    <VStack align="start" gap={3}>
      <Heading size="xl">🏠 Главная страница</Heading>
      <Text>Этот контент вставился точно на место компонента Outlet!</Text>
    </VStack>
  );
};
// Компонент для страницы "О нас"
export const About = () => {
  return (
    <VStack align="start" gap={3}>
      <Heading size="xl">ℹ️ О нас</Heading>
      <Text>Мы используем связку Vite, React, Chakra v3 и React Router.</Text>
    </VStack>
  );
}
  export const Setting = () => {
    return (
      <VStack align="start" gap={3}>
        <Heading size="xl">ℹ️ Настройка</Heading>
        <Text>Мы используем связку Vite, React, Chakra v3 и React Router.</Text>
      </VStack>
    );
};
