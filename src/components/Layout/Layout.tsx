import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { Page } from '../../types/interfaces'
import Sidebar from '../Sidebar/Sidebar'

interface Props {
  pages: Page[]
}

const Layout = ({ pages }: Props) => {
  return (
    <Flex
      h='100vh'
      w='100vw'
      direction='row'
    >
      <Sidebar pages={pages} />
      <Box
        p={6}
        w={{ base: '90%', md: '80%' }}
        h='full'
        marginInline='auto'
      >
        <Outlet />
      </Box>
    </Flex>
  )
}

export default Layout
