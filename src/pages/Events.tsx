import { useState, useRef, ReactElement } from 'react'
import {
  Flex,
  Heading,
  Portal,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Tag,
  TagLabel,
  Box
} from '@chakra-ui/react'
import {
  ColumnDef,
  createColumnHelper
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import { FaPlus } from 'react-icons/fa'
import useEvents from '../hooks/useEvents'
import { IEvent } from '../types/interfaces'
import Table from '../components/Table/Table'
import ActionButtons from '../components/ActionButton/ActionButton'
import EditEventForm from '../components/Forms/EditEventForm'
import AddEventForm from '../components/Forms/AddEventForm'
import FilterCard from '../components/FilterCard/FilterCard'

const Events = () => {
  const {
    status,
    rows,
    handleFilterChange,
    filterInputs,
    limit,
    setLimit,
    skip,
    setSkip,
    addEvent,
    deleteEvent,
    count,
    eventSubmit
  } = useEvents()
  const [modalContent, setModalContent] = useState<ReactElement | null>(null)
  const [modalTitle, setModalTitle] = useState('')
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure()
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null)

  const onEdit = (id: string) => {
    const event = rows.find(row => row._id === id)
    if (event) {
      setModalContent(
        <EditEventForm
          event={event}
          onClose={onModalClose}
          onSubmit={eventSubmit}
        />
      )
      setModalTitle('Editar evento')
      onModalOpen()
    }
  }

  const onDelete = (id: string) => {
    const event = rows.find(row => row._id === id)
    if (event) {
      setSelectedEvent(event)
      onDeleteOpen()
    }
  }

  const onDeleteConfirm = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent._id)
      onDeleteClose()
    }
  }

  const columnHelper = createColumnHelper<IEvent>()

  const columns: ColumnDef<IEvent, any>[] = [
    columnHelper.accessor('title', {
      header: () => <span>Título</span>,
      cell: info => info.getValue()
    }),
    columnHelper.accessor('description', {
      header: () => <span>Descripción</span>,
      cell: info => info.getValue()
    }),
    columnHelper.accessor('start', {
      header: () => <span>Inicio</span>,
      cell: info => dayjs(info.getValue()).format('DD / MM / YYYY hh:mm A')
    }),
    columnHelper.accessor('end', {
      header: () => <span>Fin</span>,
      cell: ({ getValue }) => {
        const date = getValue()
        return date ? dayjs(date).format('DD / MM / YYYY hh:mm A') : null
      }
    }),
    columnHelper.accessor('published', {
      header: () => <span>Publicado?</span>,
      cell: info => info.getValue() ? 'Si' : 'No'
    }),
    {
      id: 'actions',
      header: () => <span>Acciones</span>,
      cell: info => (
        <ActionButtons
          id={info.row.original._id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )
    }
  ]

  const cancelRef = useRef(null)

  const onAddEvent = () => {
    setModalTitle('Crear nuevo evento')
    setModalContent(
      <AddEventForm
        onClose={onModalClose}
        onSubmit={eventSubmit}
      />
    )
    onModalOpen()
  }

  return (
    <>
      <Heading mb={5}>Eventos</Heading>
      <Flex
        my={4}
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        w='full'
      >
        <Box>
          <Tag size='lg' borderRadius='xl' variant='normal'>
            <TagLabel>Total: {count}</TagLabel>
          </Tag>
        </Box>
        <Box>
          <Button
            variant='normal'
            leftIcon={<FaPlus />}
            onClick={onAddEvent}
          >
            Crear
          </Button>
        </Box>
      </Flex>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        w='full'
        gap={4}
      >
        <FilterCard
          filters={filterInputs}
          handleFilterChange={handleFilterChange}
        />
        <Table
          columns={columns}
          rows={rows}
          isLoading={status === 'loading'}
        />
      </Flex>
      <Portal>
        <Modal isOpen={isModalOpen} onClose={onModalClose}>
          <ModalOverlay />
          <ModalContent bgColor='bg.alt' borderRadius='xl'>
            <ModalHeader>{modalTitle}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {modalContent}
            </ModalBody>
          </ModalContent>
        </Modal>
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent bgColor='bg.alt'>
              <AlertDialogHeader>
                Eliminar evento
              </AlertDialogHeader>
              <AlertDialogBody>
                Esta operación no se puede deshacer, ¿deseas continuar?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={onDeleteClose}
                  variant='brand'
                >
                  Cancelar
                </Button>
                <Button
                  ml={3}
                  onClick={onDeleteConfirm}
                  variant='alt'
                >
                  Eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Portal>
    </>
  )
}

export default Events
