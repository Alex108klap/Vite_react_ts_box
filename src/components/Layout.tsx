// src/components/Layout.tsx
import { Link, Outlet } from "react-router-dom";
import { Flex, Button, Container, Heading } from "@chakra-ui/react";

export const Layout = () => {
  return (
    // Наружный контейнер на всю высоту экрана (Chakra v3 minH="100vh")
    <Flex direction="column" minH="100vh" bg="bg.muted">
      
      {/* ================= НАВИГАЦИЯ (ШАПКА) ================= */}
      {/* Этот блок будет виден ВСЕГДА, на любой странице */}
      <Flex as="nav" bg="bg.panel" p={4} borderBottomWidth="1px" gap={4} justify="center">
        {/* В Chakra v3 пропс asChild позволяет корректно стилизовать Link из React Router */}
        <Button asChild variant="ghost">
          <Link to="/">Главная</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/about">О нас</Link>
        </Button>
        <Button asChild variant="ghost" ms="auto">
          <Link to="/setting">Настройка</Link>
        </Button>
        
      </Flex>
      
      {/* ================= КОНТЕНТНАЯ ОБЛАСТЬ ================= */}
      {/* flex="1" заставляет этот блок занять всё свободное место, прижимая футер к низу */}
      <Container maxW="3xl" py={8} flex="1" bg="bg.panel" borderRadius="md" shadow="sm">
        
        {/* МАГИЯ ТУТ: Сюда React Router будет подставлять Home или About */}
        <Outlet />
      
      </Container>
      
      {/* ================= ПОДВАЛ (ФУТЕР) ================= */}
      {/* Этот блок тоже статичен и никогда не исчезает */}
      <Flex as="footer" bg="bg.panel"  p={4} justify="center">
        <Heading size="xs">© 2026 Моё Крутое Приложение</Heading>
      </Flex>
    
    </Flex>
  );
};
