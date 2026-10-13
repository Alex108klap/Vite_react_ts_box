import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  // ВСЕ настройки кастомизации (tokens, semanticTokens, recipes) 
  // в v3 ОБЯЗАТЕЛЬНО оборачиваются в объект theme
  theme: {
    // 1. Базовые токены
    tokens: {
      colors: {
        brand: {
          500: { value: "#0070f3" },
          600: { value: "#EFCC57FF" },
        },
      },
      fonts: {
        heading: { value: '"Inter", sans-serif' },
        body: { value: '"Roboto", sans-serif' },
        brand: { value: '"Comic Sans MS", cursive' }
      },
      radii: {
        full: { value: "9999px" }
      },
      fontSizes: {
        "2xs": { value: "0.625rem" },
        "4xs": { value: "1.250rem" },
        "8xs": { value: "2.500rem" },
        huge: { value: "5rem" }
      }
    },
    
    // 2. Семантические токены (для поддержки light/dark режимов)
    semanticTokens: {
      colors: {
        bg: {
          brand: { 
            value: {
              _light: "{colors.brand.500}",
              _dark: "{colors.brand.600}" 
            } 
          }
        },
        text: {
          primary: { 
            value: {
              _light: "{colors.gray.50}",
              _dark: "{colors.gray.900}" 
            } 
          },
          secondary: { 
            value: {
              _light: "{colors.gray.900}",
              _dark: "{colors.gray.50}" 
            } 
          }
        }
      }
    },
    
    // 3. Рецепты компонентов
    recipes: {
      button: {
        className: "chakra-button",
        base: {
          borderRadius: "full",
          fontWeight: "bold",
          px: "6",
          py: "3",
          cursor: "pointer",
          transition: "all 0.2s"
        },
        variants: {
          variant: {
            solid: {
              bg: "bg.brand",
              color: "blackAlpha.950",
              _hover: { opacity: "0.8" }
            }
          }
        },
        defaultVariants: {
          variant: "solid"
        }
      },
      input: {
        className: "chakra-input",
        base: {
          borderRadius: "full",
          color: "fg",
          bg: "transparent",
          px: "6",
          borderColor: "gray.700",
          _focusVisible: {
            borderColor: "bg.brand",
            boxShadow: "0 0 0 1px {colors.brand.500}"
          }
        }
      }
    }
  }
})

export const system = createSystem(defaultConfig, customConfig)
