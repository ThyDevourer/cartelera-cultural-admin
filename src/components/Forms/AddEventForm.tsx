import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Switch,
  chakra
} from '@chakra-ui/react'
import {
  useForm,
  SubmitHandler
} from 'react-hook-form'
import { IEvent } from '../../types/interfaces'

type FormValues = Omit<IEvent, 'active'>

interface Props {
  onSubmit: (payload: FormValues) => void
  onClose: () => void
}

const AddEventForm = ({ onClose, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      flyer: '',
      start: '',
      end: '',
      ticketLink: '',
      locationName: '',
      published: false,
      categories: []
    }
  })

  const submitHandler: SubmitHandler<FormValues> = async (data) => {
    onSubmit(data)
    onClose()
  }

  return (
    <chakra.form onSubmit={handleSubmit(submitHandler)}>
      <VStack pb={4}>
        <FormControl>
          <FormLabel>Título</FormLabel>
          <Input variant='filled' type='text' {...register('title')} />
        </FormControl>
        <FormControl>
          <FormLabel>Descripción</FormLabel>
          <Textarea variant='filled' {...register('description')} />
        </FormControl>
        <FormControl>
          <FormLabel>Fecha de inicio</FormLabel>
          <Input variant='filled' type='datetime-local' {...register('start')} />
        </FormControl>
        <FormControl>
          <FormLabel>Fecha de finalización</FormLabel>
          <Input variant='filled' type='datetime-local' {...register('end')} />
        </FormControl>
        <FormControl>
          <FormLabel>Link para comprar boletos</FormLabel>
          <Input variant='filled' type='text' {...register('ticketLink')} />
        </FormControl>
        <FormControl>
          <FormLabel>Ubicación</FormLabel>
          <Input variant='filled' type='text' {...register('locationName')} />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor='published'>Publicado?</FormLabel>
          <Switch id='published' {...register('published')} />
        </FormControl>
        <Button alignSelf='end' type='submit'>Guardar</Button>
      </VStack>
    </chakra.form>
  )
}

export default AddEventForm

