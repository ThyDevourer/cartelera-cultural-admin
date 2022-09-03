import {
  ChakraProvider,
  ColorModeScript
} from '@chakra-ui/react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { theme } from './styles/theme'
import {
  FaCalendarAlt,
  FaListUl,
  FaHome
} from 'react-icons/fa'
import Layout from './components/Layout/Layout'

import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import Verify from './pages/Verify'
import Events from './pages/Events'
import Categories from './pages/Categories'

import { Page } from './types/interfaces'

const pages: Page[] = [
  {
    title: 'Eventos',
    description: 'Ver, crear, editar y eliminar eventos',
    href: '/events',
    icon: <FaCalendarAlt />,
    element: <Events />
  },
  {
    title: 'Categorías',
    description: 'Ver, crear, editar y eliminar categorías',
    href: '/categories',
    icon: <FaListUl />,
    element: <Categories />
  }
]

pages.unshift({
  href: '/',
  title: 'Inicio',
  icon: <FaHome />,
  element: <Home pages={pages} />
})

const queryClient = new QueryClient()

const App = () => {
  return (
    <>
      <ColorModeScript />
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout pages={pages} />}>
                {pages.map(page => (
                  <Route
                    key={page.title}
                    path={page.href}
                    element={
                      <PrivateRoute>
                        {page.element}
                      </PrivateRoute>
                    }
                  />
                ))}
              </Route>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route
                path='/verify'
                element={
                  <PrivateRoute>
                    <Verify />
                  </PrivateRoute>
                }
              />
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
            <ReactQueryDevtools />
          </BrowserRouter>
        </QueryClientProvider>
      </ChakraProvider>
    </>
  )
}

export default App
