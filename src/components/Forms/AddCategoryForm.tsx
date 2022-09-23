import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  chakra
} from '@chakra-ui/react'
import {
  useForm,
  SubmitHandler
} from 'react-hook-form'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import {
  object,
  string,
  nonempty
} from 'superstruct'
import { FaSave } from 'react-icons/fa'
import { ICategory } from '../../types/interfaces'

const schema = object({
  name: nonempty(string())
})

interface Props {
  onClose: () => void
  onSubmit: (category: ICategory) => void
}

const AddCategoryForm = ({ onClose, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<ICategory>({
    resolver: superstructResolver(schema)
  })

  const submitHandler: SubmitHandler<ICategory> = async (data) => {
    onSubmit(data)
    onClose()
  }

  return (
    <chakra.form onSubmit={handleSubmit(submitHandler)}>
      <VStack pb={4}>
        <FormControl isInvalid={!!errors.name} pb={4} isRequired>
          <FormLabel>Nombre</FormLabel>
          <Input variant='normal' type='text' {...register('name')} />
        </FormControl>
        <Button
          alignSelf='end'
          type='submit'
          leftIcon={<FaSave />}
          variant='alt'
        >
          Guardar
        </Button>
      </VStack>
    </chakra.form>
  )
}

export default AddCategoryForm
