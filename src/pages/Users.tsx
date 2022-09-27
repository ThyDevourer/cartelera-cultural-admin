import { ReactElement, useState, useRef } from 'react'
import {
  Flex,
  Heading,
  Tag,
  TagLabel,
  Text,
  Box,
  Button,
  Stack,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Portal,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure
} from '@chakra-ui/react'
import {
  FaPlus,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaEdit
} from 'react-icons/fa'
import {
  ColumnDef,
  createColumnHelper
} from '@tanstack/react-table'
import { useUsers } from '../hooks/useUsers'
import FilterCard from '../components/FilterCard/FilterCard'
import Table from '../components/Table/Table'
import { capitalize } from 'lodash'
import { ActionDef, IUser } from '../types/interfaces'
import HeaderButton from '../components/HeaderButton/HeaderButton'
import dayjs from 'dayjs'
import AddUserForm from '../components/Forms/AddUserForm'
import EditUserForm from '../components/Forms/EditUserForm'

const Users = () => {
  const {
    status,
    rows,
    filterInputs,
    handleFilterChange,
    limit,
    setLimit,
    sort,
    toggleSort,
    count,
    page,
    setPage,
    maxPage,
    lowerShown,
    upperShown,
    addUser,
    editUser,
    deleteUser
  } = useUsers()
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
  const [toDelete, setToDelete] = useState<IUser | null>(null)

  const onAddUser = () => {
    setModalTitle('Crear usuario')
    setModalContent(
      <AddUserForm
        onClose={onModalClose}
        onSubmit={user => addUser(user)}
      />
    )
    onModalOpen()
  }

  const onEditUser = (id: string) => {
    const user = rows.find(row => row._id === id)
    if (user) {
      setModalTitle('Editar usuario')
      setModalContent(
        <EditUserForm
          user={user}
          onClose={onModalClose}
          onSubmit={editUser}
        />
      )
      onModalOpen()
    }
  }

  const onDeleteUser = (id: string) => {
    const user = rows.find(row => row._id === id)
    if (user) {
      setToDelete(user)
      onDeleteOpen()
    }
  }

  const onDeleteConfirm = () => {
    if (toDelete) {
      deleteUser(toDelete._id)
      onDeleteClose()
    }
  }

  const actions: ActionDef[] = [
    {
      name: 'edit',
      label: 'Editar',
      icon: <FaEdit />,
      callback: id => onEditUser(id),
      disabled: false
    },
    {
      name: 'delete',
      label: 'Borrar',
      icon: <FaTrash />,
      callback: id => onDeleteUser(id),
      disabled: false
    }
  ]

  const columnHelper = createColumnHelper<IUser>()
  const columns: ColumnDef<IUser, any>[] = [
    columnHelper.accessor('username', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Usuario'
          sort={sort}
          column={col.column.id}
        />
      )
    }),
    columnHelper.accessor('name', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Nombre'
          sort={sort}
          column={col.column.id}
        />
      )
    }),
    columnHelper.accessor('lastName', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Apellido'
          sort={sort}
          column={col.column.id}
        />
      )
    }),
    columnHelper.accessor('email', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Correo'
          sort={sort}
          column={col.column.id}
        />
      )
    }),
    columnHelper.accessor('role', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Rol'
          sort={sort}
          column={col.column.id}
        />
      ),
      cell: ({ getValue }) => capitalize(getValue())
    }),
    columnHelper.accessor('verified', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Verified?'
          sort={sort}
          column={col.column.id}
        />
      ),
      cell: ({ getValue }) => getValue() ? 'Si' : 'No'
    }),
    columnHelper.accessor('registeredAt', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Fecha de Registro'
          sort={sort}
          column={col.column.id}
        />
      ),
      cell: ({ getValue }) => dayjs(getValue()).format('DD / MM / YYYY hh:mm A')
    }),
    {
      id: 'actions',
      header: () => <span>Acciones</span>,
      cell: info => (
        <HStack>
          {actions.map(action => (
            <Button
              key={action.name}
              variant='alt'
              onClick={() => action.callback(info.row.original._id)}
              title={action.label}
              disabled={action.disabled}
            >
              {action.icon}
            </Button>
          ))}
        </HStack>
      )
    }
  ]

  const cancelRef = useRef(null)

  return (
    <>
      <Heading mb={5}>Usuarios</Heading>
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
            onClick={onAddUser}
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
                Eliminar usuario
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

export default Users
