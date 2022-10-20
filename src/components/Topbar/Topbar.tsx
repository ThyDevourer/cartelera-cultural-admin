import {
  Button,
  IconButton,
  HStack,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  useBreakpointValue
} from '@chakra-ui/react'
import {
  useNavigate,
  useLocation
} from 'react-router-dom'
import { IoMdMenu, IoMdArrowBack, IoMdClose } from 'react-icons/io'
import { FaLock, FaUserCircle } from 'react-icons/fa'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'
import type { Page } from '../../types/interfaces'

interface Props {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  pages: Page[]
  onLogout: () => void
}

const Topbar = ({
  isOpen,
  onOpen,
  onClose,
  pages,
  onLogout
}: Props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const breadcrumbsVisible = useBreakpointValue({ base: false, sm: true })

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
        {breadcrumbsVisible && <Breadcrumbs pathname={location.pathname} pages={pages} />}
      </HStack>
      <HStack>
        <Menu>
          <MenuButton
            as={IconButton}
            variant='alt'
            rounded='full'
            h='2.5em'
            w='2.5em'
            alignItems='center'
            icon={<FaUserCircle size={24} />}
          >
          </MenuButton>
          <MenuList>
            <MenuItem
              icon={<FaLock />}
              onClick={onLogout}
            >
              Cerrar sesión
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  )
}

export default Topbar
