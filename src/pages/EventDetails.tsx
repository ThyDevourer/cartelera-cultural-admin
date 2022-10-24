import { useParams } from 'react-router-dom'
import { useEvent } from '../hooks/useEvents'
import {
  Center,
  Spinner,
  Text,
  Image,
  Flex,
  Box,
  Tag,
  Wrap,
  Button,
  Tooltip,
  TagLabel,
  Icon,
  VStack,
  Link
} from '@chakra-ui/react'
import {
  FaMapMarkedAlt,
  FaCheckCircle,
  FaEdit,
  FaUserEdit,
  FaCalendarAlt,
  FaExternalLinkAlt
} from 'react-icons/fa'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/es-mx'
import { Title } from 'react-head'
import DetailsHeader from '../components/DetailsHeader/DetailsHeader'
import { imageBaseUrl } from '../utils/constants'
import { IUser } from '../types/interfaces'

dayjs.extend(localizedFormat)
dayjs.locale('es-mx')

const EventDetails = () => {
  const { id } = useParams<'id'>()
  const {
    status,
    data,
    togglePublished,
    isLoading: isToggleLoading
  } = useEvent(id as string)

  const onClickPublish = () => {
    if (data) {
      togglePublished()
    }
  }

  const published = !!data?.data.published

  const PublishButton = (
    <Button
      variant='alt'
      onClick={onClickPublish}
      rightIcon={published ? <FaEdit /> : <FaCheckCircle />}
      isLoading={isToggleLoading}
    >
      {published ? 'Convertir a Borrador' : 'Publicar'}
    </Button>
  )

  if (status === 'loading') {
    return <Center w='full' h='full'><Spinner size='xl' /></Center>
  } else if (status === 'error') {
    return <Center w='full' h='full'><Text fontSize='72px'>An error has ocurred :(</Text></Center>
  }

  const {
    start: startDate,
    end: endDate,
    flyer,
    ticketLink,
    createdBy
  } = data!.data
  const author = createdBy as IUser

  return (
    <>
      <Title>{data!.data.title} - Cartelera Cultural de Ensenada</Title>
      <DetailsHeader title={data?.data.title as string} tools={PublishButton} />
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={16}
        mb={8}
      >
        <Box w={{ base: 'full', lg: '50%' }} flexBasis='55%'>
          <Flex mb={4} justifyContent='space-between'>
            <Tag variant='slim'>
              <Icon as={FaUserEdit} mr={2} />
              <Tooltip label={`${author.name} ${author.lastName}`}>
                <TagLabel>{author.username}</TagLabel>
              </Tooltip>
            </Tag>
            {ticketLink
              ? (
                <Link href={ticketLink} isExternal>
                  Venta de boletos <Icon as={FaExternalLinkAlt} boxSize={3} />
                </Link>
                )
              : 'Sin venta de boletos'}
          </Flex>
          <Flex
            gap={4}
            direction='column'
            justifyContent='start'
            w='full'
            flexBasis='45%'
          >
            <Flex
              direction='row'
              alignItems='center'
              justifyContent='start'
              gap={4}
              borderRadius='xl'
              mt={4}
            >
              <Center
                ml={2}
                mr={{ base: 0, md: 2 }}
                p={4}
                bgColor='bg.alt'
                borderRadius='full'
              >
                <Icon
                  as={FaCalendarAlt}
                  boxSize={6}
                />
              </Center>
              <VStack alignItems='start'>
                <Text>{capitalize(dayjs(startDate).format('llll'))}{endDate && ' -'}</Text>
                {endDate && <Text>{capitalize(dayjs(endDate).format('llll'))}</Text>}
              </VStack>
            </Flex>
            <Flex
              direction='row'
              alignItems='center'
              justifyContent='start'
              gap={4}
              borderRadius='xl'
              mb={4}
            >
              <Center
                ml={2}
                mr={{ base: 0, md: 2 }}
                p={4}
                bgColor='bg.alt'
                borderRadius='full'
              >
                <Icon
                  as={FaMapMarkedAlt}
                  boxSize={6}
                />
              </Center>
              <Box>
                {data?.data.locationName}
              </Box>
            </Flex>
            <Text mb={4}>{data?.data.description}</Text>
            <Wrap>
              <Text alignSelf='center'>Categorías:</Text>
              {data?.data.categories.map(category => (
                <Tag
                  key={`category-${category._id}`}
                  borderRadius='xl'
                  variant='slim'
                >
                  {category.name}
                </Tag>
              ))}
            </Wrap>
          </Flex>
        </Box>
        <Center
          w='100%'
          borderRadius='xl'
          flexBasis='45%'
          m={4}
        >
          <Image
            src={`${imageBaseUrl}${flyer}`}
            fit='cover'
            borderRadius='xl'
          />
        </Center>
      </Flex>
    </>
  )
}

export default EventDetails
