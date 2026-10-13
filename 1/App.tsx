import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useColorMode } from '@/components/ui/color-mode'
import { LuSun, LuMoon } from 'react-icons/lu'

// Обратите внимание: в v3 многие булевы пропсы стали стандартными HTML-атрибутами
// Вместо colorScheme="teal" теперь используется гибкая система colorPalette

function App() {
  const { colorMode, toggleColorMode } = useColorMode()
  
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" p={4}>
      <VStack spaceY={6} p={8} borderWidth="1px" borderRadius="lg" boxShadow="md" maxW="400px" textAlign="center">
        <Heading size="2xl">Chakra UI v3 ✨</Heading>
        
        <Text color="fg.muted">
          Проект успешно развернут с использованием Vite, React, TypeScript и pnpm.
        </Text>
        
        <HStack spaceX={4}>
          <Button colorPalette="teal" variant="solid">
            Вперед!
          </Button>
          
          <Button variant="outline" onClick={toggleColorMode}>
            {colorMode === 'light' ? <LuMoon /> : <LuSun />}
            {colorMode === 'light' ? 'Темная' : 'Светлая'} тема
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default App
