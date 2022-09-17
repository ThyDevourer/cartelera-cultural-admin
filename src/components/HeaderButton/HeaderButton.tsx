import { Button, Text } from '@chakra-ui/react'
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa'

interface Props {
  onClick?: () => void
  text: string
  sort: string
  column: string
}

const HeaderButton = ({ onClick, text, sort, column }: Props) => {
  if (!onClick) {
    return <span>{text}</span>
  }

  let sortIcon

  if (sort === column) {
    sortIcon = <FaSortUp />
  } else if (sort === `-${column}`) {
    sortIcon = <FaSortDown />
  } else {
    sortIcon = <FaSort />
  }

  return (
    <Button
      onClick={onClick}
      variant='link'
      rightIcon={sortIcon}
    >
      <Text
        fontSize='xs'
        textTransform='uppercase'
        fontWeight='bold'
      >
        {text}
      </Text>
    </Button>
  )
}

export default HeaderButton
