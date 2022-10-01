import {
  Flex,
  Input,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Box,
  Center
} from '@chakra-ui/react'
import { FaFilter } from 'react-icons/fa'
import { Select as MSelect } from 'chakra-react-select'
import { FilterShape } from '../../types/interfaces'

interface Props {
  filters: FilterShape[]
  handleFilterChange: (value: any, type: string) => void
}

const FilterCard = ({ filters, handleFilterChange }: Props) => {
  const toRender = filters.map(filter => {
    let input
    if (filter.type === 'select') {
      input = (
        <>
          <Select
            w='full'
            variant='normal'
            onChange={e => handleFilterChange(e.target.value, filter.field)}
          >
            {filter.options.map(({ name, value }) => (
              <option key={`${name}.${value}`} value={value}>{name}</option>
            ))}
          </Select>
        </>
      )
    } else if (filter.type === 'multi') {
      input = (
          <MSelect
            isMulti
            options={filter.options.map(opt => ({ ...opt, label: opt.name }))}
            variant='filled'
            useBasicStyles
            onChange={value => handleFilterChange(value, filter.field)}
          />
      )
    } else {
      input = (
          <Input
            w='full'
            variant='normal'
            type={filter.type}
            placeholder={filter.placeholder ?? ''}
            onChange={e => handleFilterChange(e.target.value, filter.field)}
          />
      )
    }
    return (
      <FormControl key={filter.field} mb={4}>
        <FormLabel ml={2} mb={1} fontSize='sm'>{filter.name}</FormLabel>
        {input}
      </FormControl>
    )
  })

  return (
    <VStack
      bgColor='bg.alt'
      borderRadius='xl'
      h='min-content'
    >
      <Flex
        justifyContent='start'
        alignItems='center'
        gap={4}
        w='full'
        bgColor='brand.500'
        borderTopRadius='xl'
      >
        <Center ml={6}>
          <FaFilter />
        </Center>
        <Text
          fontSize='xs'
          textTransform='uppercase'
          fontWeight='bold'
          py={3}
        >
          Filtrar por:
        </Text>
      </Flex>
      <Box w='full' px={4}>
        {toRender}
      </Box>
    </VStack>
  )
}

export default FilterCard
