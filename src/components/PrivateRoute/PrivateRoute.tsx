import { ReactElement } from 'react'
import { useSessionStore } from '../../hooks/useSessionStore'
import { Navigate, useLocation } from 'react-router-dom'

interface Props {
  children: ReactElement
}

const PrivateRoute = ({ children }: Props) => {
  const isLoggedIn = useSessionStore(state => state.isLoggedIn)
  const { verified } = useSessionStore(state => state.user)
  const location = useLocation()

  if (!isLoggedIn && location.pathname !== '/login') {
    return <Navigate to='/login' replace />
  }
  if (!verified && location.pathname !== '/verify') {
    return <Navigate to='/verify' replace />
  }
  return children
}

export default PrivateRoute
