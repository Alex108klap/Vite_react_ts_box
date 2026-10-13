import {Card, Heading,Text} from "@chakra-ui/react";
import { useParams, } from "react-router-dom";

// Динамическая страница личного кабинета
export const Dashboard = () => {
  const { userId } = useParams(); // Считывает :userId из строки браузера

  return (
    <Card.Root maxW="md">
      <Card.Body>
        <Heading size="md" mb={2}>Панель управления</Heading>
        <Text>Вы зашли как пользователь с ID: **{userId}**</Text>
      </Card.Body>
    </Card.Root>
  );
};