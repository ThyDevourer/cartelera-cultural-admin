import {
  HStack,
  Button
} from '@chakra-ui/react'
import {
  FaEdit,
  FaTrash
} from 'react-icons/fa'

interface Props {
  id: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const ActionButtons = ({ id, onEdit, onDelete }: Props) => {
  // const { role } = useSessionStore(state => state.user)

  const actions = [
    {
      name: 'Editar',
      icon: <FaEdit />,
      callback: () => onEdit(id),
      disabled: false
    }, {
      name: 'Eliminar',
      icon: <FaTrash />,
      callback: () => onDelete(id),
      disabled: false
    }
  ]

  return (
    <HStack>
      {actions.map(action => (
        <Button
          variant='alt'
          key={action.name}
          onClick={action.callback}
          disabled={action.disabled}
        >
          {action.icon}
        </Button>
      ))}
    </HStack>
  )
}

export default ActionButtons
