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
  category: ICategory
}

const EditCategoryForm = ({ onClose, onSubmit, category }: Props) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<ICategory>({
    resolver: superstructResolver(schema),
    defaultValues: {
      name: category.name
    }
  })

  const submitHandler: SubmitHandler<ICategory> = async (data) => {
    console.log({ ...category, ...data })
    onSubmit({ ...category, ...data })
  }

  return (
    <chakra.form onSubmit={handleSubmit(submitHandler)}>
      <VStack pb={4}>
        <FormControl isInvalid={!!errors.name} pb={4}>
          <FormLabel>Nombre</FormLabel>
          <Input variant='normal' type='text' {...register('name')} />
        </FormControl>
        <Button
          onClick={onClose}
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

export default EditCategoryForm
