
import { Link } from "react-router-dom";
import { Card, Image, Text, Button, SimpleGrid } from "@chakra-ui/react";

// Пример списка товаров в каталоге
const PRODUCTS = [
  { id: 1, title: "Наушники", price: "12 990 ₽", img: "https://placehold.co" },
  { id: 2, title: "Смартфон", price: "79 990 ₽", img: "https://placehold.co" },
];

export default function CatalogPage() {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap="6" p="6">
      {PRODUCTS.map((item) => (
        <Card.Root key={item.id} maxW="sm" overflow="hidden">
          <Image src={item.img} alt={item.title} />
          <Card.Body gap="2">
            <Card.Title>{item.title}</Card.Title>
            <Text fontSize="lg" fontWeight="bold">{item.price}</Text>
          </Card.Body>
          <Card.Footer>
            {/* ГЛАВНОЕ: Кнопка-ссылка, которая ведет на /product/1 или /product/2 */}
            <Button as={Link} to={`/product/${item.id}`} colorPalette="blue" width="full">
              Посмотреть товар
            </Button>
          </Card.Footer>
        </Card.Root>
      ))}
    </SimpleGrid>
  );
}
