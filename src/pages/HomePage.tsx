import { useState } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Icon,
  Flex,
  Input,
  createListCollection
} from "@chakra-ui/react";
import { LuShoppingCart, LuStar } from "react-icons/lu";

// Импортируем локальные CLI-компоненты из вашей папки ui/
import { Button } from "@/components/ui/button";
import {
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValueText
} from "@/components/ui/select";

// Описание типа для карточки товара
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  rating: number;
  emoji: string;
  gradient: string;
  isNew?: boolean;
}

// Генерация статического массива из ровно 20 товаров
const MOCK_PRODUCTS: Product[] = Array.from({ length: 20 }, (_, index) => {
  const categories = ["Электроника", "Одежда", "Обувь", "Аксессуары"];
  const category = categories[index % categories.length];
  
  // Конфигурация уникального внешнего вида для каждой категории товаров
  const designMap: Record<string, { emoji: string; gradient: string }> = {
    "Электроника": { emoji: "🎧", gradient: "linear-gradient(135deg, #2B6CB0 0%, #1A365D 100%)" },
    "Одежда": { emoji: "👕", gradient: "linear-gradient(135deg, #319795 0%, #1D4044 100%)" },
    "Обувь": { emoji: "👟", gradient: "linear-gradient(135deg, #DD6B20 0%, #5F2706 100%)" },
    "Аксессуары": { emoji: "🕶️", gradient: "linear-gradient(135deg, #805AD5 0%, #322659 100%)" }
  };
  
  return {
    id: index + 1,
    title: `Смарт-устройство и аксессуар #${index + 1} (${category})`,
    price: Math.floor(Math.random() * 9000) + 1000,
    category,
    rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
    emoji: designMap[category].emoji,
    gradient: designMap[category].gradient,
    isNew: index % 5 === 0,
  };
});

// Создание коллекций данных для выпадающих списков селектов (Требование Chakra v3)
const categoriesCollection = createListCollection({
  items: [
    { label: "Все категории", value: "all" },
    { label: "Электроника", value: "Электроника" },
    { label: "Одежда", value: "Одежда" },
    { label: "Обувь", value: "Обувь" },
    { label: "Аксессуары", value: "Аксессуары" },
  ],
});

const sortCollection = createListCollection({
  items: [
    { label: "По умолчанию", value: "default" },
    { label: "Сначала дешевые", value: "price-asc" },
    { label: "Сначала дорогие", value: "price-desc" },
    { label: "Высокий рейтинг", value: "rating" },
  ],
});

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>(["all"]);
  const [sortBy, setSortBy] = useState<string[]>(["default"]);
  
  // Состояние количества товаров в корзине интернет-магазина
  const [cartCount, setCartCount] = useState(0);
  
  // Извлекаем строковые значения для логики работы фильтрации и сортировки
  const activeCategory = categoryFilter[0] || "all";
  const activeSort = sortBy[0] || "default";
  
  // Комплексный пайплайн фильтрации каталога товаров на лету
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (activeSort === "price-asc") return a.price - b.price;
    if (activeSort === "price-desc") return b.price - a.price;
    if (activeSort === "rating") return b.rating - a.rating;
    return 0;
  });
  
  return (
    <Box minH="100vh" bg="bg.muted" pb={12}>
      {/* Навигационная панель интернет-магазина */}
      <Box as="nav" bg="bg.panel" boxShadow="sm" borderBottomWidth="1px" position="sticky" top={0} zIndex={10} py={4}>
        <Container maxW="container.xl">
          <Flex align="center" justify="space-between" gap={4} wrap="wrap">
            <Heading size="md" fontWeight="bold" color="teal.600">
              ⚡ СТИЛЬ-МАРКЕТ
            </Heading>
            
            {/* Поле поиска по названию */}
            <Box flex={1} maxW="500px" mx={{ md: 4 }}>
              <Input
                placeholder="Поиск из 20 товаров..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="bg.default"
              />
            </Box>
            
            {/* Кнопка открытия корзины со счетчиком кликов */}
            <Button variant="ghost" colorPalette="teal" onClick={() => alert(`В корзине товаров: ${cartCount}`)}>
              <Icon as={LuShoppingCart} mr={2} />
              Корзина ({cartCount})
            </Button>
          </Flex>
        </Container>
      </Box>
      
      {/* Контентная зона магазина */}
      <Container maxW="container.xl" mt={8}>
        
        {/* Заголовок каталога и панель фильтров */}
        <Flex gap={4} direction={{ base: "column", md: "row" }} justify="space-between" mb={8} align={{ md: "center" }}>
          <VStack align="flex-start" gap={1}>
            <Heading size="lg">Каталог товаров</Heading>
            <Text color="fg.muted" fontSize="sm">Найдено: {filteredProducts.length}</Text>
          </VStack>
          
          <HStack gap={4} wrap="wrap" width={{ base: "100%", md: "auto" }}>
            {/* Селект выбора категории */}
            <SelectRoot
              size="sm"
              width="200px"
              collection={categoriesCollection}
              value={categoryFilter}
              onValueChange={(e) => setCategoryFilter(e.value)}
              css={{
                "& [data-part='trigger']": { color: "white !important" },
                "& [data-part='value-text']": { color: "white !important" }
              }}
            >
              <SelectTrigger border="1px solid" borderColor="border.strong" bg="bg.panel" px={3}>
                <SelectValueText placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent bg="bg.panel" border="1px solid" borderColor="border.default" zIndex={15}>
                {categoriesCollection.items.map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
            
            {/* Селект сортировки товаров */}
            <SelectRoot
              size="sm"
              width="200px"
              collection={sortCollection}
              value={sortBy}
              onValueChange={(e) => setSortBy(e.value)}
              css={{
                "& [data-part='trigger']": { color: "white !important" },
                "& [data-part='value-text']": { color: "white !important" }
              }}
            >
              <SelectTrigger border="1px solid" borderColor="border.strong" bg="bg.panel" px={3}>
                <SelectValueText placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent bg="bg.panel" border="1px solid" borderColor="border.default" zIndex={15}>
                {sortCollection.items.map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </HStack>
        </Flex>
        
        {/* Адаптивная сетка карточек товаров */}
        {filteredProducts.length === 0 ? (
          <Flex justify="center" align="center" py={20}>
            <Text color="fg.muted" fontSize="lg">Ничего не найдено по вашему запросу</Text>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
            {filteredProducts.map((product) => (
              <Box
                key={product.id}
                bg="bg.panel"
                borderWidth="1px"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="sm"
                transition="all 0.2s"
                _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                display="flex"
                flexDirection="column"
              >
                {/* Верхняя часть карточки: Градиентное превью с Emoji */}
                <Box
                  background={product.gradient}
                  h="220px"
                  w="100%"
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  userSelect="none"
                >
                  <Text fontSize="6xl" role="img" aria-label={product.category}>
                    {product.emoji}
                  </Text>
                  
                  {product.isNew && (
                    <Badge colorPalette="teal" variant="solid" position="absolute" top={3} left={3} borderRadius="md">
                      NEW
                    </Badge>
                  )}
                </Box>
                
                {/* Нижняя часть карточки: Описание, Рейтинг, Цена и Кнопка */}
                <VStack p={4} align="stretch" gap={3} flex={1} justify="space-between">
                  <VStack align="stretch" gap={1}>
                    <Text color="fg.muted" fontSize="xs" textTransform="uppercase" fontWeight="bold" letterSpacing="wider">
                      {product.category}
                    </Text>
                    <Heading size="xs" lineClamp={2} minH="40px">
                      {product.title}
                    </Heading>
                  </VStack>
                  
                  <Flex justify="space-between" align="center" mt={2}>
                    <Text fontSize="xl" fontWeight="extrabold" color="fg.default">
                      {product.price.toLocaleString()} ₽
                    </Text>
                    <HStack gap={1} color="amber.500">
                      <Icon as={LuStar} fill="currentColor" size="sm" />
                      <Text fontSize="sm" fontWeight="bold">{product.rating}</Text>
                    </HStack>
                  </Flex>
                  
                  {/* Интерактивная кнопка покупки */}
                  {/* ИСПРАВЛЕНО: Явно задали белый цвет текста и увеличили высоту контейнера */}
                  <Button
                    colorPalette="teal"
                    variant="solid"
                    size="sm"
                    width="100%"
                    mt={4}
                    color="white" // Принудительный белый цвет текста вместо синего
                    fontWeight="bold"
                    onClick={() => setCartCount((prev) => prev + 1)}
                  >
                    Купить
                  </Button>
                
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}