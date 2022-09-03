import { Flex, Heading, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { crud } from '../services/crud.service'
import { ICategory } from '../types/interfaces'

const Categories = () => {
  const { status, data } = useQuery(['categories'], async () => {
    const res = await crud<ICategory[]>({
      method: 'GET',
      endpoint: 'categories',
      meta: {
        limit: 10,
        skip: 10,
        filter: 'Hola'
      }
    })
    return res
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }
  if (status === 'error') {
    return <div>:(</div>
  }
  return (
    <>
      <Heading>Categorías</Heading>
      {data.data.map((category) => (
        <Flex key={category._id}>
          <Text>{category.name}</Text>
        </Flex>
      ))}
    </>
  )
}

export default Categories
