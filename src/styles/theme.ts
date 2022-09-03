import {
  extendTheme,
  ThemeConfig,
  ComponentStyleConfig
} from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
}

const Button: ComponentStyleConfig = {
  variants: {
    brand: {
      bg: 'bg.alt',
      borderRadius: 'xl',
      _hover: {
        backgroundColor: '#541269'
      },
      _active: {
        backgroundColor: '#70188C'
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
      300: '#A204DC'
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
    Button
  }
})
