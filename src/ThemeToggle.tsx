import { Button } from "@chakra-ui/react"
import { useColorMode } from "@/components/ui/color-mode"

export const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  
  return (
    <Button onClick={toggleColorMode}>
      Включить {colorMode === "light" ? "Темную" : "Светлую"} тему
    </Button>
  )
}
