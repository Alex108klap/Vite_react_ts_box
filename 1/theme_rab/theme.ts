import { createSystem, defaultConfig, defineConfig, defineRecipe } from "@chakra-ui/react"

const buttonRecipe = defineRecipe({
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
        bg: "colorPalette.solid",
        color: "colorPalette.contrast",
        _hover: {
          bg: "colorPalette.emphasized",
        }
      },
      outline: {
        borderWidth: "1px",
        borderColor: "colorPalette.solid",
        color: "colorPalette.solid",
        _hover: {
          bg: "colorPalette.subtle",
        }
      }
    }
  },
  defaultVariants: {
    variant: "solid",
    colorPalette: "brand"
  }
})

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f1fe" },
          100: { value: "#cce3fd" },
          200: { value: "#99c7fa" },
          300: { value: "#66aaf7" },
          400: { value: "#338ef4" },
          500: { value: "#0070f3" },
          600: { value: "#EFCC57FF" },
          700: { value: "#d4b343" },
          800: { value: "#004494" },
          900: { value: "#002a5c" },
          950: { value: "#00152e" },
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
      fontWeights: {
        monoDefault: { value: "350" },
        mono: { value: "350" },
      },
      fontSizes: {
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
        "2xl": { value: "1.5rem" },
        "3xl": { value: "1.875rem" },
        "8xs": { value: "2.500rem" },
        huge: { value: "5rem" }
      },
    },
    
    // Семантические токены связывают вашу кастомную палитру "brand" с системными свойствами
    semanticTokens: {
      colors: {
        "colorPalette.solid": {
          value: {
            base: "{colors.brand.600}",
            _dark: "{colors.brand.500}", // Чуть светлее для темной темы
          }
        },
        "colorPalette.contrast": {
          value: {
            base: "#f4db38",
            _dark: "#1A202C", // Контрастный текст на темном фоне
          }
        },
        "colorPalette.emphasized": {
          value: {
            base: "{colors.brand.100}", // Исправили дублирование с subtle
            _dark: "{colors.brand.800}",
          }
        },
        "colorPalette.subtle": {
          value: {
            base: "{colors.brand.50}",
            _dark: "{colors.brand.950}",
          }
        }
      }
    },
    
    
    recipes: {
      button: buttonRecipe,
    }
  }
})

export const system = createSystem(defaultConfig, customConfig)