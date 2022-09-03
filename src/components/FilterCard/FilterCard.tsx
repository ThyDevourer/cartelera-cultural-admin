import { ChangeEvent } from 'react'
import {
  Flex,
  Input,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Select
} from '@chakra-ui/react'
import { FaFilter } from 'react-icons/fa'
import { FilterShape } from '../../types/interfaces'

interface Props {
  filters: FilterShape[]
  handleFilterChange: (event: ChangeEvent, type: string) => void
}

const FilterCard = ({ filters, handleFilterChange }: Props) => {
  const toRender = filters.map(filter => {
    if (filter.type === 'select') {
      return (
        <FormControl key={filter.field}>
          <FormLabel>{filter.name}</FormLabel>
          <Select
            w='full'
            variant='filled'
            onChange={e => handleFilterChange(e, filter.field)}
          >
            {filter.options.map(({ name, value }) => (
              <option key={`${name}.${value}`} value={value}>{name}</option>
            ))}
          </Select>
        </FormControl>
      )
    }
    return (
      <FormControl key={filter.field}>
        <FormLabel>{filter.name}</FormLabel>
        <Input
          w='full'
          variant='filled'
          type={filter.type}
          placeholder={filter.placeholder ?? ''}
          onChange={e => handleFilterChange(e, filter.field)}
        />
      </FormControl>
    )
  })

  return (
    <VStack p={4}>
      <Flex
        justifyContent='start'
        alignItems='center'
        gap={4}
        w='full'
      >
        <FaFilter />
        <Text fontSize='l'>
          Filtrar por:
        </Text>
      </Flex>
      {toRender}
    </VStack>
  )
}

export default FilterCard
