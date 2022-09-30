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
import { capitalize, get } from 'lodash'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/es-mx'
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
    togglePublished
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
    >
      {published ? 'Convertir a Borrador' : 'Publicar'}
    </Button>
  )

  const author = get(data, 'data.createdBy', null) as IUser
  const startDate = get(data, 'data.start', '')
  const endDate = get(data, 'data.end', '')
  const ticketLink = get(data, 'data.ticketLink', '')

  if (status === 'loading') {
    return <Center w='full' h='full'><Spinner size='xl' /></Center>
  } else if (status === 'error') {
    return <Center w='full' h='full'><Text fontSize='72px'>An error has ocurred :(</Text></Center>
  }
  return (
    <>
      <DetailsHeader title={data?.data.title as string} tools={PublishButton}/>
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
              <Center
                my={6}
                pt='75%'
                w='100%'
                borderRadius='xl'
                position='relative'
                overflowY='hidden'
                style={{ transition: 'padding 0.2s' }}
                _hover={{ paddingTop: '100%' }}
              >
                <Image
                  src={`${imageBaseUrl}${data?.data.flyer}`}
                  fit='cover'
                  borderRadius='xl'
                  position='absolute'
                  top={0}
                />
              </Center>
              </Box>
              <Flex
                gap={4}
                mb={4}
                direction='column'
                justifyContent='start'
                w='full'
                flexBasis='45%'
              >
                <Flex
                  direction='row'
                  alignItems='center'
                  justifyContent={{ base: 'center', md: 'start' }}
                  gap={4}
                  borderRadius='xl'
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
                  justifyContent={{ base: 'center', md: 'start' }}
                  gap={4}
                  borderRadius='xl'
                  mb={8}
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
              </Flex>
              </>
  )
}

export default EventDetails
