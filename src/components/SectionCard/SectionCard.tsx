import { cloneElement } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Text,
  HStack,
  Center
} from '@chakra-ui/react'
import { Page } from '../../types/interfaces'

interface Props {
  page: Page
}

const SectionCard = ({ page }: Props) => {
  const navigate = useNavigate()
  return (
    <Box
      p={6}
      w='full'
      bgColor='bg.alt'
      _hover={{
        backgroundColor: 'brand.500'
      }}
      _active={{
        backgroundColor: 'brand.400'
      }}
      borderRadius='xl'
      onClick={() => navigate(page.href)}
      cursor='pointer'
    >
      <HStack>
        <Center py={2} pl={2} pr={4}>{cloneElement(page.icon, { size: 32 })}</Center>
        <Box>
          <Text fontSize='xl' fontWeight='600'>{page.title}</Text>
          {page.description && <Text>{page.description}</Text>}
        </Box>
      </HStack>
    </Box>
  )
}

export default SectionCard
