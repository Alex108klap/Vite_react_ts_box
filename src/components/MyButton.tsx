import { Button, type ButtonProps } from "@chakra-ui/react"

interface MyButtonProps extends ButtonProps {
  colorPalette?: string
}

export function MyButton({ colorPalette, children, ...props }: MyButtonProps) {
  // Если палитра red, используем встроенную палитру, иначе дефолтную brand
  const isRed = colorPalette === "red"
  
  return (
    <Button
      borderRadius="full"
      fontWeight="bold"
      px="6"
      py="3"
      cursor="pointer"
      transition="all 0.2s"
      // Используем токен через палитру, поддерживаемую Chakra v3
      bg={isRed ? "red.600" : "brand.500"}
      color="white"
      _hover={{
        bg: isRed ? "red.700" : "brand.800",
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
