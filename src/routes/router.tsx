import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Suspense from '../components/Suspense/Suspense'
import Layout from '../components/Layout/Layout'
import PrivateRoute from '../components/PrivateRoute/PrivateRoute'
import {
  FaCalendarAlt,
  FaListUl,
  FaHome,
  FaUsers
} from 'react-icons/fa'
import { Page } from '../types/interfaces'

const Login = lazy(() => import('../pages/Login'))
const Home = lazy(() => import('../pages/Home'))
const Register = lazy(() => import('../pages/Register'))
const Verify = lazy(() => import('../pages/Verify'))
const Events = lazy(() => import('../pages/Events'))
const Categories = lazy(() => import('../pages/Categories'))
const Users = lazy(() => import('../pages/Users'))
const EventDetails = lazy(() => import('../pages/EventDetails'))

const pages: Page[] = [
  {
    title: 'Eventos',
    description: 'Ver, crear, editar y eliminar eventos',
    href: 'events',
    icon: <FaCalendarAlt />,
    element: <Events />,
    private: true,
    onMenu: true
  },
  {
    href: 'events/:id',
    element: <EventDetails />,
    private: true,
    onMenu: false
  },
  {
    title: 'Categorías',
    description: 'Ver, crear, editar y eliminar categorías',
    href: 'categories',
    icon: <FaListUl />,
    element: <Categories />,
    private: true,
    onMenu: true
  },
  {
    title: 'Usuarios',
    description: 'Gestionar cuentas de usuario',
    href: 'users',
    icon: <FaUsers />,
    element: <Users />,
    private: true,
    onMenu: true
  }
]

pages.unshift({
  href: '/',
  title: 'Inicio',
  icon: <FaHome />,
  element: <Home pages={pages} />,
  private: true,
  onMenu: true
})

export const router = createBrowserRouter([
  {
    element: <Layout pages={pages} />,
    children: pages.map(page => ({
      path: page.href,
      element: page.private
        ? <PrivateRoute>{page.element}</PrivateRoute>
        : page.element
    }))
  },
  {
    element: <Suspense />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'verify',
        element: (
          <PrivateRoute>
            <Verify />
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to='/' />
  }
])
