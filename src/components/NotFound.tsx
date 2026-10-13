import {Link, } from "react-router-dom";
import { Button, Heading, VStack } from "@chakra-ui/react";

// Страница 404 (Если адрес не существует)
export const NotFound = () => {
  return (
    <VStack align="center" py={12} gap={4}>
      <Heading size="xl" color="red.500">404 - Страница не найдена</Heading>
      <Button asChild variant="solid">
        <Link to="/">Вернуться на главную</Link>
      </Button>
    </VStack>
  );
};