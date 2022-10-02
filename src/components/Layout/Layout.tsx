import { Outlet } from 'react-router-dom'
import {
  Box,
  Flex,
  VStack,
  useDisclosure
} from '@chakra-ui/react'
import { Page } from '../../types/interfaces'
import Sidebar from '../Sidebar/Sidebar'
import Topbar from '../Topbar/Topbar'
import Suspense from '../Suspense/Suspense'

interface Props {
  pages: Page[]
}

const Layout = ({ pages }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex
      h='100vh'
      w='100vw'
      direction='row'
    >
      <Sidebar
        pages={pages}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
      <VStack
        h='100vh'
        w='full'
        overflowY='scroll'
      >
        <Box
          p={6}
          w={{ base: '100%', md: '90%' }}
          marginInline='auto'
          h='full'
        >
          <Topbar
            onOpen={onOpen}
            isOpen={isOpen}
            onClose={onClose}
            pages={pages}
          />
          <Suspense hasLayout>
            <Outlet />
          </Suspense>
        </Box>
      </VStack>
    </Flex>
  )
}

export default Layout
