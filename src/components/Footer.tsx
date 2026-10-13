import { Box, Text } from "@chakra-ui/react";

export const Footer = () => {
  return (
    // Задаем явный фоновый цвет и рамку для теста видимости
    <Box as="footer" bg="yellow.400" color="gray.900" py={4} textAlign="center" w="full">
      <Text>ТЕСТ: ДАННЫЙ ТЕКСТ ПОДВАЛА ДОЛЖЕН БЫТЬ ВИДЕН</Text>
    </Box>
  );
};
