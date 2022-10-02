import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon
} from '@chakra-ui/react'
import {
  Link,
  matchPath
} from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import type { Page } from '../../types/interfaces'

interface Props {
  pathname: string
  pages: Page[]
}

const Breadcrumbs = ({ pathname, pages }: Props) => {
  const paths = pathname === '/'
    ? [pathname]
    : ['/', ...pathname.split('/').filter(path => path !== '')]

  const fullPaths = paths.map((_, index) => {
    return ['/', paths.filter((p, i) => i <= index && p !== '/').join('/')].join('')
  })

  const matches = paths.map(path => matchPath({ path, end: false }, pathname))

  return (
    <Breadcrumb>
      {matches.map((match, i) => {
        const children = paths[i] === '/'
          ? <Icon as={FaHome} boxSize={3} />
          : pages.find(page => page.href === paths[i])?.title ?? paths[i]

        return (
          <BreadcrumbItem key={`breadcrumb-${match?.pathname ?? i}`}>
            <BreadcrumbLink as={Link} to={match ? match.pathname : fullPaths[i]}>
              {children}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}

export default Breadcrumbs
