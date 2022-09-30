import { ReactElement } from 'react'
import {
  Flex,
  Heading
} from '@chakra-ui/react'

interface Props {
  title: string
  tools?: ReactElement | ReactElement[]
}

const DetailsHeader = ({ title, tools }: Props) => {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justifyContent='space-between'
    >
      <Heading mb={4}>{title}</Heading>
      {tools && (
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={2}
          mb={{ base: 4, md: 0 }}
        >
          {tools}
        </Flex>
      )}
    </Flex>
  )
}

export default DetailsHeader
