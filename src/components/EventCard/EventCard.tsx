import {
  Box,
  Text,
  Flex
} from '@chakra-ui/react'
import { IEvent } from '../../types/interfaces'

interface Props {
  event: IEvent
}

const EventCard = ({ event }: Props) => {
  return (
    <Flex
      w='full'
      p={6}
      bgColor='bg.alt'
      borderRadius='xl'
      direction={{ base: 'column', md: 'row' }}
    >
      <Text>{event.title}</Text>
      <Text>{event.description}</Text>
      <Text>{event.published ? 'No ' : 'Publicado'}</Text>
    </Flex>
  )
}

export default EventCard
