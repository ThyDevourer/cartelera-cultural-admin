import {
  Box,
  Wrap
} from '@chakra-ui/react'
import BigCard from '../BigCard/BigCard'
import { Tool } from '../../types/interfaces'

interface Props {
  tools: Tool[]
}

const Toolbar = ({ tools }: Props) => {
  return (
    <Box w='full' mb={4}>
      <Wrap spacing={4} mb={4}>
        {tools.map(t => (
          <BigCard
            key={`BigCard-${t.title}`}
            title={t.title}
            subtitle={t.subtitle}
            onClick={t.onClick}
            />
        ))}
      </Wrap>
    </Box>
  )
}

export default Toolbar
