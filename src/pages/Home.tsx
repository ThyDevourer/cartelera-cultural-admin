import { useAuth } from '../hooks/useAuth'
import {
  Heading,
  VStack
} from '@chakra-ui/react'
import { Page } from '../types/interfaces'
import SectionCard from '../components/SectionCard/SectionCard'

interface Props {
  pages: Page[]
}

const Home = ({ pages }: Props) => {
  const { user } = useAuth()

  return (
    <>
      <Heading as='h1' mb={4}>Hola {user?.username}!</Heading>
      <VStack spacing={4}>
        {pages
          .filter(page => page.onMenu && page.href !== '/')
          .map(page => (
            <SectionCard key={page.href} page={page} />
          ))}
      </VStack>
    </>
  )
}

export default Home
