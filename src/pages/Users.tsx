import { ReactElement, useState, useRef } from 'react'
import {
  Flex,
  Tag,
  TagLabel,
  Box,
  Button,
  HStack,
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
import PaginationFooter from '../components/PaginationFooter/PaginationFooter'

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
      ),
      size: 200
    }),
    columnHelper.accessor('name', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Nombre'
          sort={sort}
          column={col.column.id}
        />
      ),
      size: 200
    }),
    columnHelper.accessor('lastName', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Apellido'
          sort={sort}
          column={col.column.id}
        />
      ),
      size: 200
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
          <PaginationFooter
            count={count}
            lowerShown={lowerShown}
            upperShown={upperShown}
            limit={limit}
            page={page}
            maxPage={maxPage}
            setLimit={setLimit}
            setPage={setPage}
          />
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
