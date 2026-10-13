"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

// 1. Создаем инстанс тостера и задаем дефолтные параметры
export const toaster = createToaster({
  placement: "top", // Дефолтное положение, если проп не передан
  pauseOnPageIdle: true,
})

// Типизация для кастомных пропсов сниппета Toaster
interface ToasterProps {
  placement?: "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end"
}

// 2. Экспортируем сам UI-компонент
export const Toaster = (props: ToasterProps) => {
  return (
    <Portal>
      {/* Пробрасываем переданный placement внутрь системного тостера Chakra */}
      <ChakraToaster toaster={toaster} placement={props.placement} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
