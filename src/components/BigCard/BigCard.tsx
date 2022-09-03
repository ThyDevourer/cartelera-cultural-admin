import {
  Box,
  Heading,
  Text
} from '@chakra-ui/react'

interface Props {
  title: string
  subtitle: string
  onClick?: () => void
}

const BigCard = ({ title, subtitle, onClick }: Props) => {
  const as = onClick ? 'button' : 'div'
  return (
    <Box
      as={as}
      w='25ch'
      p='4'
      bgColor='brand.100'
      color='bg.main'
      borderRadius='xl'
      onClick={onClick}
    >
      <Heading textAlign='left'>{title}</Heading>
      <Text textAlign='left' fontWeight={700}>{subtitle}</Text>
    </Box>
  )
}

export default BigCard
