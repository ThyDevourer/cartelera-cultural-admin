import { useState, useRef, ReactElement } from 'react'
import {
  Flex,
  Text,
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
  Box,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Tooltip
} from '@chakra-ui/react'
import {
  ColumnDef,
  createColumnHelper
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import {
  FaPlus,
  FaChevronDown,
  // FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { truncate } from 'lodash'
import useEvents from '../hooks/useEvents'
import { IEvent, ActionDef } from '../types/interfaces'
import Table from '../components/Table/Table'
import EditEventForm from '../components/Forms/EditEventForm'
import AddEventForm from '../components/Forms/AddEventForm'
import FilterCard from '../components/FilterCard/FilterCard'
import HeaderButton from '../components/HeaderButton/HeaderButton'

const Events = () => {
  const navigate = useNavigate()
  const {
    status,
    rows,
    handleFilterChange,
    filterInputs,
    limit,
    setLimit,
    page,
    maxPage,
    setPage,
    addEvent,
    updateEvent,
    deleteEvent,
    count,
    lowerShown,
    upperShown,
    sort,
    toggleSort,
    getImageUrl
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
          onSubmit={updateEvent}
          getImageUrl={getImageUrl}
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

  const actions: ActionDef[] = [
    {
      name: 'edit',
      label: 'Editar',
      icon: <FaEdit />,
      callback: id => onEdit(id),
      disabled: false
    },
    {
      name: 'delete',
      label: 'Borrar',
      icon: <FaTrash />,
      callback: id => onDelete(id),
      disabled: false
    },
    {
      name: 'details',
      label: 'Ver detalles',
      icon: <FaExternalLinkAlt />,
      callback: id => navigate(`/events/${id}`),
      disabled: false
    }
  ]

  const columnHelper = createColumnHelper<IEvent>()

  const columns: ColumnDef<IEvent, any>[] = [
    columnHelper.accessor('title', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Título'
          sort={sort}
          column={col.column.id}
        />
      ),
      cell: info => truncate(info.getValue(), { length: 35 })
    }),
    columnHelper.accessor('description', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Descripción'
          sort={sort}
          column={col.column.id}
        />
      ),
      cell: info => truncate(info.getValue(), { length: 35 })
    }),
    columnHelper.accessor('start', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Inicio'
          sort={sort}
          column={col.column.id}
        />
      ),
      cell: info => dayjs(info.getValue()).format('DD / MM / YYYY hh:mm A')
    }),
    columnHelper.accessor('end', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Fin'
          sort={sort}
          column={col.column.id}
        />
      ),
      cell: ({ getValue }) => {
        const date = getValue()
        return date ? dayjs(date).format('DD / MM / YYYY hh:mm A') : null
      }
    }),
    columnHelper.accessor('published', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Publicado?'
          sort={sort}
          column={col.column.id}
        />
      ),
      cell: info => info.getValue() ? 'Si' : 'No'
    }),
    {
      id: 'actions',
      header: () => <span>Acciones</span>,
      cell: info => (
        <HStack>
          {actions.map(action => (
            <Tooltip
              key={action.name}
              label={action.label}
            >
              <Button
                variant='alt'
                onClick={() => action.callback(info.row.original._id)}
                disabled={action.disabled}
              >
                {action.icon}
              </Button>
            </Tooltip>
          ))}
        </HStack>
      )
    }
  ]

  const cancelRef = useRef(null)

  const onAddEvent = () => {
    setModalTitle('Crear nuevo evento')
    setModalContent(
      <AddEventForm
        onClose={onModalClose}
        onSubmit={addEvent}
        getImageUrl={getImageUrl}
      />
    )
    onModalOpen()
  }

  return (
    <>
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
        <Flex
          direction='column'
          w='full'
          mb={4}
          overflowX='hidden'
          gap={4}
        >
          <Table
            columns={columns}
            rows={rows}
            isLoading={status === 'loading'}
          />
          <Flex
            w='full'
            bgColor='bg.alt'
            p={4}
            borderRadius='xl'
            alignItems='center'
            justifyContent='space-between'
            direction={{ base: 'column', lg: 'row' }}
          >
            <Text fontSize='sm'>
              Mostrando {lowerShown} a {upperShown} de {count}
            </Text>
            <Stack
              spacing={4}
              direction={{ base: 'column', md: 'row' }}
              alignItems='center'
            >
              <Text fontSize='sm'>
                Resultados por página:
              </Text>
              <Menu>
                <MenuButton
                  as={Button}
                  variant='alt'
                  rightIcon={<FaChevronDown />}
                  ml={4}
                  fontSize='sm'
                >
                  {limit}
                </MenuButton>
                <MenuList>
                  {[20, 50, 100, 200].map(value => (
                    <MenuItem
                      key={value}
                      onClick={() => setLimit(value)}
                    >
                      {value}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Text fontSize='sm'>
                Página {page + 1} de {maxPage + 1}
              </Text>
              <Button
                variant='alt'
                disabled={page === 0}
                onClick={() => setPage(prev => prev - 1)}
              >
                <FaChevronLeft />
              </Button>
              <Button
                variant='alt'
                disabled={page === maxPage}
                onClick={() => setPage(prev => prev + 1)}
              >
                <FaChevronRight />
              </Button>
            </Stack>
          </Flex>
        </Flex>
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
