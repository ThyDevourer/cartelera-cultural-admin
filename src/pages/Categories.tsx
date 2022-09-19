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
import { useCategories } from '../hooks/useCategories'
import FilterCard from '../components/FilterCard/FilterCard'
import Table from '../components/Table/Table'
import { truncate } from 'lodash'
import { ICategory, ActionDef } from '../types/interfaces'
import HeaderButton from '../components/HeaderButton/HeaderButton'
import AddCategoryForm from '../components/Forms/AddCategoryForm'
import EditCategoryForm from '../components/Forms/EditCategoryForm'

const Categories = () => {
  const {
    status,
    rows,
    filterInputs,
    handleFilterChange,
    limit,
    setLimit,
    page,
    maxPage,
    setPage,
    lowerShown,
    upperShown,
    count,
    sort,
    toggleSort,
    addCategory,
    editCategory,
    deleteCategory
  } = useCategories()
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
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState<ReactElement | null>(null)
  const [toDelete, setToDelete] = useState<ICategory | null>(null)

  const columnHelper = createColumnHelper<ICategory>()

  const onAddCategory = () => {
    setModalTitle('Crear categoría')
    onModalOpen()
    setModalContent(
      <AddCategoryForm
        onClose={onModalClose}
        onSubmit={category => addCategory(category)}
      />
    )
  }

  const onEditCategory = (id: string) => {
    const category = rows.find(row => row._id === id)
    if (category) {
      setModalTitle('Editar categoría')
      onModalOpen()
      setModalContent(
        <EditCategoryForm
          category={category}
          onClose={onModalClose}
          onSubmit={category => editCategory(category)}
        />
      )
    }
  }

  const onDeleteCategory = (id: string) => {
    const category = rows.find(row => row._id === id)
    if (category) {
      setToDelete(category)
      onDeleteOpen()
    }
  }

  const onDeleteConfirm = () => {
    if (toDelete) {
      deleteCategory(toDelete._id)
      onDeleteClose()
    }
  }

  const actions: ActionDef[] = [
    {
      name: 'edit',
      label: 'Editar',
      icon: <FaEdit />,
      callback: (id) => onEditCategory(id),
      disabled: false
    },
    {
      name: 'delete',
      label: 'Borrar',
      icon: <FaTrash />,
      callback: (id) => onDeleteCategory(id),
      disabled: false
    }
  ]

  const columns: ColumnDef<ICategory, any>[] = [
    columnHelper.accessor('name', {
      header: col => (
        <HeaderButton
          onClick={() => toggleSort(col.header.id)}
          text='Nombre'
          sort={sort}
          column={col.column.id}
        />
      ),
      cell: ({ getValue }) => truncate(getValue(), { length: 35 })
    }),
    {
      id: 'actions',
      header: () => <span>Acciones</span>,
      cell: info => (
        <HStack w='min-content' ml='auto'>
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
      <Heading mb={5}>Categorías</Heading>
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
            onClick={onAddCategory}
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

export default Categories
