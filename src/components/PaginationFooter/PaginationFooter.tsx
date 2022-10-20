import type { Dispatch, SetStateAction } from 'react'
import {
  Flex,
  Text,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Button
} from '@chakra-ui/react'
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa'

interface Props {
  count: number
  lowerShown: number
  upperShown: number
  limit: number
  page: number
  maxPage: number
  setLimit: Dispatch<SetStateAction<number>>
  setPage: Dispatch<SetStateAction<number>>
}

const PaginationFooter = ({
  count,
  lowerShown,
  upperShown,
  limit,
  setLimit,
  page,
  maxPage,
  setPage
}: Props) => {
  return (
    <Flex
      w='full'
      bgColor='bg.alt'
      p={4}
      borderRadius='xl'
      alignItems='center'
      justifyContent='space-between'
      direction={{ base: 'column', lg: 'row' }}
    >
      <Text fontSize='sm'>
        {count === 0 ? 'Nada qué mostrar' : `Mostrando ${lowerShown} a ${upperShown} de ${count}`}
      </Text>
      <Stack
        spacing={4}
        direction={{ base: 'column', md: 'row' }}
        alignItems='center'
      >
        <Text fontSize='sm'>
          Resultados por página:
        </Text>
        <Menu>
          <MenuButton
            as={Button}
            variant='alt'
            rightIcon={<FaChevronDown />}
            ml={4}
            fontSize='sm'
          >
            {limit}
          </MenuButton>
          <MenuList>
            {[20, 50, 100, 200].map(value => (
              <MenuItem
                key={value}
                onClick={() => setLimit(value)}
              >
                {value}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Text fontSize='sm'>
          Página {page + 1} de {maxPage + 1}
        </Text>
        <HStack>
          <Button
            variant='alt'
            disabled={page === 0}
            onClick={() => setPage(prev => prev - 1)}
          >
            <FaChevronLeft />
          </Button>
          <Button
            variant='alt'
            disabled={page === maxPage}
            onClick={() => setPage(prev => prev + 1)}
          >
            <FaChevronRight />
          </Button>
        </HStack>
      </Stack>
      </Flex>
  )
}

export default PaginationFooter
