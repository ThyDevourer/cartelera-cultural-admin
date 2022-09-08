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
import { superstructResolver } from '@hookform/resolvers/superstruct'
import {
  object,
  string,
  optional,
  boolean,
  nonempty,
  refine,
  instance
} from 'superstruct'
import dayjs from 'dayjs'
import { IEvent } from '../../types/interfaces'

type FormValues = Omit<IEvent, 'active' | 'flyer'> & { flyer: FileList }

interface Props {
  onSubmit: (payload: Omit<FormValues, 'flyer'>, image: FileList) => void
  onClose: () => void
}

const schema = object({
  title: nonempty(string()),
  description: nonempty(string()),
  flyer: instance(FileList),
  start: nonempty(string()),
  end: optional(refine(string(), 'isAfterStart', (value, { branch }) => {
    if (dayjs(value).isValid()) {
      return dayjs(value).isAfter(branch[0].start)
    }
    return true
  })),
  ticketLink: optional(string()),
  locationName: optional(string()),
  published: boolean()
})

const AddEventForm = ({ onClose, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FormValues>({
    resolver: superstructResolver(schema)
  })

  const submitHandler: SubmitHandler<FormValues> = async (data) => {
    const { flyer, ...rest } = data
    onSubmit(rest, flyer)
    onClose()
  }

  return (
    <chakra.form onSubmit={handleSubmit(submitHandler)} encType='multipart/form-data'>
      <VStack pb={4}>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>Título</FormLabel>
          <Input variant='filled' type='text' {...register('title')} />
        </FormControl>
        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Descripción</FormLabel>
          <Textarea variant='filled' {...register('description')} />
        </FormControl>
        <FormControl isInvalid={!!errors.start}>
          <FormLabel>Fecha de inicio</FormLabel>
          <Input variant='filled' type='datetime-local' {...register('start')} />
        </FormControl>
        <FormControl isInvalid={!!errors.end}>
          <FormLabel>Fecha de finalización</FormLabel>
          <Input
            variant='filled'
            type='datetime-local'
            {...register('end')}
          />
        </FormControl>
        <FormControl isInvalid={!!errors.ticketLink}>
          <FormLabel>Link para comprar boletos</FormLabel>
          <Input variant='filled' type='text' {...register('ticketLink')} />
        </FormControl>
        <FormControl isInvalid={!!errors.locationName}>
          <FormLabel>Ubicación</FormLabel>
          <Input variant='filled' type='text' {...register('locationName')} />
        </FormControl>
        <FormControl isInvalid={!!errors.published}>
          <FormLabel htmlFor='published'>Publicado?</FormLabel>
          <Switch id='published' {...register('published')} />
        </FormControl>
        <FormControl isInvalid={!!errors.flyer}>
          <Input type='file' {...register('flyer')} />
        </FormControl>
        <Button alignSelf='end' type='submit'>Guardar</Button>
      </VStack>
    </chakra.form>
  )
}

export default AddEventForm
