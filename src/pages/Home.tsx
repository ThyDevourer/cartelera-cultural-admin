import { useSessionStore } from '../hooks/useSessionStore'
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
  const user = useSessionStore(state => state.user)

  return (
    <>
      <Heading as='h1' mb={4}>Hola {user.username}!</Heading>
      <VStack spacing={4}>
        {pages
          .filter(page => page.href !== '/')
          .map(page => (
            <SectionCard key={page.href} page={page} />
          ))}
      </VStack>
    </>
  )
}

export default Home
