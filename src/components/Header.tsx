import { Box, Container, Flex, Heading, Button, Spacer, Group } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function Header() {
  // Выносим массив ссылок, чтобы не дублировать JSX-код
  const navigationLinks = [
    { name: "Главная", path: "/" },
    { name: "О нас", path: "/about" },
    { name: "Услуги", path: "/services" },
  ];
  
  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      borderColor="border.muted"
      bg="bg.panel"
      py="4"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Container maxW="8xl">
        <Flex align="center" gap="4">
          
          <Heading as="h1" size="md" tracking="tight">
            ⚡ MyViteApp
          </Heading>
          
          <Spacer />
          
          {/* Навигационное меню */}
          <Group as="nav" gap="2" display={{ base: "none", md: "flex" }}>
            {navigationLinks.map((link) => (
              <Button
                key={link.path}
                variant="ghost"
                size="sm"
                asChild // В Chakra v3 передает стили кнопки внутрь компонента NavLink
              >
                {/*
                  NavLink автоматически добавляет класс .active к тегу <a>,
                  если текущий URL совпадает с пропом to.
                  Мы используем встроенную функцию в className для динамической стилизации.
                */}
                <NavLink
                  to={link.path}
                  style={({ isActive }) => ({
                    // Стили для активной ссылки (в v3 значения берем из дизайн-токенов)
                    backgroundColor: isActive ? "var(--chakra-colors-bg-muted)" : "transparent",
                    color: isActive ? "var(--chakra-colors-fg-info)" : "inherit",
                    fontWeight: isActive ? "600" : "400",
                    borderRadius: "var(--chakra-radii-md)",
                  })}
                >
                  {link.name}
                </NavLink>
              </Button>
            ))}
          </Group>
          
          <Button colorScheme="blue" size="sm">
            Войти
          </Button>
        
        </Flex>
      </Container>
    </Box>
  );
}
