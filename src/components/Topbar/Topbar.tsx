import {
  Button,
  HStack
} from '@chakra-ui/react'
import {
  useNavigate,
  useLocation
} from 'react-router-dom'
import { IoMdMenu, IoMdArrowBack, IoMdClose } from 'react-icons/io'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'
import type { Page } from '../../types/interfaces'

interface Props {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  pages: Page[]
}

const Topbar = ({ isOpen, onOpen, onClose, pages }: Props) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <HStack
      w='full'
      justifyContent='space-between'
      mb={4}
    >
      <HStack spacing={4}>
        <Button
          variant='normal'
          onClick={() => isOpen ? onClose() : onOpen()}
        >
          {isOpen ? <IoMdClose /> : <IoMdMenu />}
        </Button>
        <Button
          variant='normal'
          onClick={() => navigate(-1)}
          disabled={location.pathname === '/'}
        >
          <IoMdArrowBack />
        </Button>
        <Breadcrumbs pathname={location.pathname} pages={pages} />
      </HStack>
    </HStack>
  )
}

export default Topbar
