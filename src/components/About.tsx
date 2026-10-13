import {Heading, Text, VStack} from "@chakra-ui/react";

// Страница "О нас"
export const About = () => {
  return (
    <VStack align="start" gap={4}>
      <Heading size="2xl">О нас</Heading>
      <Text>Мы создаем современные веб-приложения на стеке Vite, React и Chakra UI v3.</Text>
    </VStack>
  );
};