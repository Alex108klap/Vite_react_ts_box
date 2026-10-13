import { MyButton } from "@/components/MyButton"
import {Flex, Box, Text, Group, Badge,Button,  Heading, Center} from "@chakra-ui/react"

import {ColorModeButton} from "@/components/ui/color-mode";
// import {Heading} from "lucide-react";

export default function MyPage() {
  return (
    <>
      {/* Кнопка с дефолтной палитрой brand */}
      <MyButton variant="solid">
        Брендовая кнопка
      </MyButton>
      <MyButton colorPalette="red" variant="solid">
        Красная кнопка
      </MyButton>
      
      <Box colorPalette="orange" p="4" borderWidth="1px" borderRadius="lg">
        <Group>
          {/* Кнопка и Badge автоматически станут оранжевыми */}
          <MyButton variant="solid">Подтвердить</MyButton>
          <Badge variant="subtle">В обработке</Badge>
        </Group>
      </Box>
      
      {/*<Flex  bg="bg.brand" justify="space-around" align="center">...!!!!!!</Flex>*/}
      
      {/*<Flex direction="column" align="center"> /!* Элементы встанут друг под другом *!/*/}
      {/*  <Box>Box1</Box>*/}
      {/*  <Box>Box2</Box>*/}
      {/*</Flex>*/}
      
      {/*<Flex bg="gray.400" justify="space-around" py={2}> /!* Разнесет элементы по краям горизонтально *!/*/}
      {/*  <Box>Box1_Слева</Box>*/}
      {/*  <p>Рравное пространство вокруг каждого элемента</p>*/}
      {/*  <Box>Box2_Справа</Box>*/}
      {/*</Flex>*/}
      
      {/*<Flex justify="space-between" py={4}> /!* Разнесет элементы по краям горизонтально *!/*/}
      {/*  <Box>Box1_Слева</Box>*/}
      {/*  <p>по краям, с равными промежутками между ними</p>*/}
      {/*  <Box>Box2_Справа</Box>*/}
      {/*</Flex>*/}
      
      <Flex bg="brand.600"  align="center" justify="center"   h="50px" w="200px" mx="auto" borderRadius="10px" > {/* Выровняет элементы по вертикали по центру */}
        <Box   color="red.800" border="1px solid" borderColor="brand.600"> Я по центру высоты</Box>
      </Flex>
     
      
      <Flex bg="blue.500"  p={8}  marginBottom="20px" marginTop="20px" h="50px" w="400px" align="center" justify="center" borderRadius="10px">
        Я синий флекс-контейнер
      </Flex>
      
      <Flex color="red.900" mx="auto" bg="brand.100" p="10"   h="50px" w="400px" align="center" justify="center" borderRadius="10px">
        Полная запись пропа
      </Flex>
      
      <Button marginTop="20px"
      display="inline-block"
      // pos="fixed" top="0px" left="0px"
      justifyContent="flex-end"
      bg= "yellow.300"
      color="black"
           onClick={() => alert("Нажато!")}>
      Нажми меня
    </Button>
      
      <Flex direction="column" gap="4">
        <Heading  size="2xl">Заголовок</Heading>
        <Text fontFamily="heading">Основной  (Roboto)</Text>
        <Text color= "buttonkn" >
          Текст с семантическим цветом
        </Text>
      </Flex>
      
      {/*<Text fontSize="huge" fontWeight="bold">*/}
      {/*  БОЛЬШОЙ ТЕКСТ*/}
      {/*</Text>*/}
      
      {/*<Text fontSize="xs">*/}
      {/*  Очень маленький текст*/}
      {/*</Text>*/}
      
      {/*<Button borderRadius="button" bg="bg.brand">*/}
      {/*  Кнопка со скруглением 12px*/}
      {/*</Button>*/}
      
      {/*<Box borderRadius="card" bg="bg.card" p="6" border="1px solid">*/}
      {/*  Карточка со скруглением 24px*/}
      {/*</Box>*/}
      
     
      {/*<Button rounded="full" variant="solid" colorPalette="blue">*/}
      {/*  Круглая кнопка*/}
      {/*</Button>*/}
      
      <Center h="10vh" w="100vw">
        <Button rounded="full" bg="brand.600" color="black" p="3px" fontSize="3xs" w="90px"
                h="90px">
          Я Круглая
        </Button>
      </Center>
      
      <Flex direction="column" gap="6" p="10" align="start">
        {/* Кнопка теперь сама знает свой цвет и радиус */}
        {/*<Button>Круглая кнопка</Button>*/}
        
        {/* Вы всё еще можете менять её на лету */}
        <Button bg="red.500" borderRadius="button">
          Я кнопка с другим радиусом
        </Button>
        <ColorModeButton />
        <Text fontSize="huge" fontFamily="heading" >
          Большой техт
        </Text>
      </Flex>
      <Flex borderRadius="18px" mx="auto" direction="column" gap="6" p="10" bg="yellow.800" minH="30vh" w="400px">
        <Text fontSize="3xs" fontWeight="mono" color="white" font="brand">
          Маленький техт
        </Text>
        
        {/* Теперь кнопка обязана подтянуть стили из recipes в theme.ts */}
        <Button  bg="red.100" borderRadius="button" color="gray.900">Я круг по умолчанию!</Button>
      </Flex>
      
      <Flex direction="column" gap="6" p="10" align="start">
        <Text fontSize="3xl" fontWeight="monoDefault" color="white">Title</Text>
        <Button bg="red.50" borderRadius="button">Я круглая по умолчанию!</Button>
      </Flex>
    
    </>
  )
}
