import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)

const baseStyle = definePartsStyle({
  list: {
    borderRadius: 'xl',
    border: 'none',
    bgColor: 'bg.alt',
    opacity: 1,
    overflow: 'hidden'
  },
  item: {
    _hover: {
      bg: 'brand.400'
    },
    _focus: {
      bg: 'brand.500'
    }
  }
})

export const menuTheme = defineMultiStyleConfig({ baseStyle })
