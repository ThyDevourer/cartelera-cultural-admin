import { lazy } from 'react'
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
import { Page } from './types/interfaces'
import Suspense from './components/Suspense/Suspense'

const Login = lazy(() => import('./pages/Login'))
const Home = lazy(() => import('./pages/Home'))
const Register = lazy(() => import('./pages/Register'))
const Verify = lazy(() => import('./pages/Verify'))
const Events = lazy(() => import('./pages/Events'))
const Categories = lazy(() => import('./pages/Categories'))

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
              <Route element={<Suspense />}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route
                  path='/verify'
                  element={
                    <PrivateRoute>
                      <Suspense>
                        <Verify />
                      </Suspense>
                    </PrivateRoute>
                  }
                />
              </Route>
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
