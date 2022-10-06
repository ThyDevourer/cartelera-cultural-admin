import {
  Button,
  HStack,
  Icon,
  Menu,
  MenuList,
  MenuButton,
  MenuItem
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
      <HStack>
        <Menu>
          <MenuButton as={Button} variant='alt' p={0} m={0} rounded='full'>
            <Icon as={FaUserCircle} m={0} p={0} />
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
