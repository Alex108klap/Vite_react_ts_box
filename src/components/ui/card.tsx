import { Card as ChakraCard } from "@chakra-ui/react"
import * as React from "react"

// Создаем Root с поддержкой всех системных пропсов (включает variant, size и т.д.)
export const CardRoot = React.forwardRef<HTMLDivElement, ChakraCard.RootProps>(
  function CardRoot(props, ref) {
    return <ChakraCard.Root ref={ref} {...props} />
  },
)

export const CardBody = ChakraCard.Body
export const CardFooter = ChakraCard.Footer
export const CardHeader = ChakraCard.Header
export const CardTitle = ChakraCard.Title
export const CardDescription = ChakraCard.Description

// Группируем для удобного использования как <Card.Root>
export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Body: CardBody,
  Footer: CardFooter,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
})