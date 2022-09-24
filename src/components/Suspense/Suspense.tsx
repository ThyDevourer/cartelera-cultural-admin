import { ReactElement, Suspense as ReactSuspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Center, Spinner } from '@chakra-ui/react'

interface SuspenseProps {
  children?: ReactElement | ReactElement[]
  hasLayout?: boolean
}

interface FallbackProps {
  hasLayout: boolean
}

const Fallback = ({ hasLayout }: FallbackProps) => {
  const [w, h] = hasLayout ? ['full', 'full'] : ['100vw', '100vh']
  return (
    <Center w={w} h={h}><Spinner size='xl' /></Center>
  )
}

const Suspense = ({ children, hasLayout = false }: SuspenseProps) => (
  <ReactSuspense fallback={<Fallback hasLayout={hasLayout} />}>
    {children ?? <Outlet />}
  </ReactSuspense>
)

export default Suspense
