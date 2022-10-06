import { ReactElement } from 'react'
import { useSessionStore } from '../../hooks/useSessionStore'
import { Navigate, useLocation } from 'react-router-dom'

interface Props {
  children: ReactElement
}

const PrivateRoute = ({ children }: Props) => {
  const user = useSessionStore(state => state.user)
  const location = useLocation()

  if (!user && location.pathname !== '/login') {
    return <Navigate to='/login' replace />
  }
  if (!user?.verified && location.pathname !== '/verify') {
    return <Navigate to='/verify' replace />
  }
  return children
}

export default PrivateRoute
