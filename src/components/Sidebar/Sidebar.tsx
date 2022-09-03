import { useState } from 'react'
import {
  Box,
  VStack,
  Button,
  Tooltip,
  HStack,
  Text
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Page } from '../../types/interfaces'
import { FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa'

interface Props {
  pages: Page[]
}

const Menu = ({ pages }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <Box
      h='100vh'
      py={4}
      pl={2}
      bgColor='brand.100'
      position='fixed'
    >
      <VStack w={isOpen ? '20ch' : 'initial'}>
        <Tooltip
          label={`${isOpen ? 'Cerrar' : 'Abrir'} menú`}
          aria-label='Menú lateral'
          placement='right'
          hasArrow
          arrowSize={10}
          isDisabled={isOpen}
        >
          <Button
            variant='transparent'
            color='bg.main'
            onClick={() => setIsOpen(prev => !prev)}
          >
            {isOpen
              ? <FaAngleDoubleLeft />
              : <FaAngleDoubleRight />}
          </Button>
        </Tooltip>
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
              borderRadius={0}
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
    </Box>
  )
}

export default Menu
