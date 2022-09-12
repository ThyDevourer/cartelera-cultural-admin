import {
  Box,
  VStack,
  Button,
  Tooltip,
  HStack,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Page } from '../../types/interfaces'

interface Props {
  pages: Page[]
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const Menu = ({ pages, isOpen, onClose }: Props) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isDesktop = useBreakpointValue({ base: false, lg: true })

  const menuContent = (
    <VStack w={isOpen ? isDesktop ? '20ch' : 'full' : 'initial'}>
      {pages.map(page => (
        <Tooltip
          key={page.href}
          label={page.title}
          aria-label={page.title}
          placement='right'
          hasArrow
          arrowSize={10}
          isDisabled={isOpen}
        >
          <Button
            w='full'
            variant='transparent'
            bgColor={pathname === page.href ? 'bg.main' : 'brand.100'}
            color={pathname === page.href ? 'fg.main' : 'bg.main'}
            borderRightRadius={isDesktop ? 0 : 'xl'}
            borderLeftRadius='xl'
            onClick={() => navigate(page.href)}
          >
            <HStack w='full'>
              <Text>{page.icon}</Text>
              <Text>{isOpen && page.title}</Text>
            </HStack>
          </Button>
        </Tooltip>
      ))}
    </VStack>
  )

  if (!isDesktop) {
    return (
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent bgColor='bg.alt'>
          <DrawerHeader>Menú</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            {menuContent}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Box
      h='100vh'
      py={4}
      pl={2}
      bgColor='brand.100'
      position='sticky'
      top={0}
      left={0}
      zIndex='docked'
    >
      {menuContent}
    </Box>
  )
}

export default Menu
