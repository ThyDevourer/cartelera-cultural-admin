import {
  extendTheme,
  ThemeConfig,
  ComponentStyleConfig
} from '@chakra-ui/react'
import { set } from 'lodash'
import { menuTheme } from './menu'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
}

const Button: ComponentStyleConfig = {
  variants: {
    normal: {
      bg: 'bg.alt',
      borderRadius: 'xl',
      _hover: {
        backgroundColor: 'brand.500'
      },
      _active: {
        backgroundColor: 'brand.400'
      }
    },
    brand: {
      color: 'bg.main',
      bg: 'brand.300',
      borderRadius: 'xl',
      _hover: {
        backgroundColor: 'brand.100'
      },
      _active: {
        backgroundColor: 'brand.400'
      }
    },
    alt: {
      bg: 'brand.500',
      borderRadius: 'xl',
      _hover: {
        bg: 'brand.400'
      },
      _active: {
        bg: 'brand.500'
      }
    }
  }
}

const Input: ComponentStyleConfig = {
  variants: {
    filled: {
      field: {
        bg: 'brand.500',
        _hover: {
          bg: 'brand.400'
        },
        borderRadius: 'xl',
        _placeholder: { color: 'brand.100', opacity: 0.8 }
      }
    }
  }
}

set(Input, 'variants.normal', Input?.variants?.filled ?? {})

const Textarea: ComponentStyleConfig = {
  variants: {
    normal: {
      bg: 'brand.500',
      _hover: {
        bg: 'brand.400'
      },
      borderRadius: 'xl',
      _placeholder: { color: 'brand.100', opacity: 0.8 }
    }
  }
}

const Tag: ComponentStyleConfig = {
  variants: {
    normal: {
      container: {
        borderRadius: 'xl',
        fontWeight: 'bold',
        bg: 'bg.alt',
        px: 4,
        py: 3
      }
    },
    slim: {
      container: {
        borderRadius: 'xl',
        fontWeight: 'regular',
        bg: 'bg.alt',
        px: 3,
        py: 1
      }
    }
  }
}

export const theme = extendTheme({
  config,
  colors: {
    bg: {
      main: '#1C0623',
      alt: '#380C46'
    },
    fg: {
      main: '#DCF7F9'
    },
    brand: {
      100: '#B33EDE',
      200: '#BB0FFA',
      300: '#A204DC',
      400: '#70188C',
      500: '#541269'
    }
  },
  styles: {
    global: {
      '*': {
        fontFamily: 'Atkinson Hyperlegible, sans-serif'
      },
      h1: {
        fontFamily: 'Atkinson Hyperlegible, sans-serif'
      },
      h2: {
        fontFamily: 'Atkinson Hyperlegible, sans-serif !important'
      },
      body: {
        bg: 'bg.main',
        color: 'fg.main'
      }
    }
  },
  components: {
    Button,
    Input,
    Select: Input,
    Textarea,
    Tag,
    Menu: menuTheme
  }
})
