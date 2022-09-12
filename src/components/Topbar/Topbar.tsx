import {
  Box,
  Button,
  HStack
} from '@chakra-ui/react'
import {
  useNavigate,
  useLocation
} from 'react-router-dom'
import { IoMdMenu, IoMdArrowBack, IoMdClose } from 'react-icons/io'

interface Props {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const Topbar = ({ isOpen, onOpen, onClose }: Props) => {
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
      </HStack>
    </HStack>
  )
}

export default Topbar
