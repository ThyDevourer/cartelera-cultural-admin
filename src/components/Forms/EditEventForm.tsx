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
import dayjs from 'dayjs'

type FormValues = Omit<IEvent, 'active'>

interface Props {
  event: IEvent
  onClose: () => void
}

const EditEventForm = ({ event, onClose }: Props) => {
  const {
    title,
    description,
    flyer,
    start,
    end,
    ticketLink,
    locationName,
    published,
    categories
  } = event
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FormValues>({
    defaultValues: {
      title,
      description,
      flyer,
      start: dayjs(start).format('YYYY-MM-DDTHH:mm'),
      end: dayjs(end).format('YYYY-MM-DDTHH:mm') ?? '',
      ticketLink: ticketLink ?? '',
      locationName,
      published,
      categories
    }
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data, errors)
    onClose()
  }

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)}>
      <VStack pb={4}>
        <FormControl>
          <FormLabel>Título</FormLabel>
          <Input variant='normal' type='text' {...register('title')} />
        </FormControl>
        <FormControl>
          <FormLabel>Descripción</FormLabel>
          <Textarea variant='normal' {...register('description')} />
        </FormControl>
        <FormControl>
          <FormLabel>Fecha de inicio</FormLabel>
          <Input variant='normal' type='datetime-local' {...register('start')} />
        </FormControl>
        <FormControl>
          <FormLabel>Fecha de finalización</FormLabel>
          <Input variant='normal' type='datetime-local' {...register('end')} />
        </FormControl>
        <FormControl>
          <FormLabel>Link para comprar boletos</FormLabel>
          <Input variant='normal' type='text' {...register('ticketLink')} />
        </FormControl>
        <FormControl>
          <FormLabel>Ubicación</FormLabel>
          <Input variant='normal' type='text' {...register('locationName')} />
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

export default EditEventForm
