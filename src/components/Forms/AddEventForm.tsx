import { useRef } from 'react'
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Switch,
  chakra,
  HStack,
  Text
} from '@chakra-ui/react'
import {
  useForm,
  SubmitHandler,
  Controller
} from 'react-hook-form'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import {
  object,
  string,
  optional,
  boolean,
  nonempty,
  refine,
  instance,
  array
} from 'superstruct'
import dayjs from 'dayjs'
import { FaCloudUploadAlt, FaSave } from 'react-icons/fa'
import { truncate } from 'lodash'
import { Select } from 'chakra-react-select'
import { IEvent, SubmitParams } from '../../types/interfaces'
import { useCategories } from '../../hooks/useCategories'

type FormValues = Omit<IEvent, 'active' | 'flyer' | 'categories'> & {
  flyer: FileList
  categories: { label: string, value: string }[]
}

interface Props {
  onSubmit: ({
    payload,
    image,
    action
  }: SubmitParams<Omit<IEvent, 'active' | 'flyer' | 'categories'> & { categories: string[] }>) => void
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
  published: boolean(),
  categories: nonempty(array(object({
    label: string(),
    value: string()
  })))
})

const AddEventForm = ({ onClose, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {
      errors
    }
  } = useForm<FormValues>({
    resolver: superstructResolver(schema)
  })
  const { rows: categories } = useCategories()
  const options = categories.map(category => ({ label: category.name, value: category._id }))

  const submitHandler: SubmitHandler<FormValues> = async (data) => {
    const { flyer, categories: cats, ...rest } = data
    onSubmit({
      payload: {
        ...rest,
        categories: cats.map(c => c.value)
      },
      image: flyer,
      action: 'add'
    })
    onClose()
  }

  const { ref: uploadInputRef, ...uploadInputProps } = register('flyer')
  const uploadInputClickRef = useRef<HTMLElement | null>(null)

  const selectedFile = watch('flyer')

  return (
    <chakra.form onSubmit={handleSubmit(submitHandler)} encType='multipart/form-data'>
      <VStack pb={4}>
        <FormControl isInvalid={!!errors.title} isRequired>
          <FormLabel>Título</FormLabel>
          <Input variant='normal' type='text' {...register('title')} />
        </FormControl>
        <FormControl isInvalid={!!errors.description} isRequired>
          <FormLabel>Descripción</FormLabel>
          <Textarea variant='normal' {...register('description')} />
        </FormControl>
        <FormControl isInvalid={!!errors.start} isRequired>
          <FormLabel>Fecha de inicio</FormLabel>
          <Input variant='normal' type='datetime-local' {...register('start')} />
        </FormControl>
        <FormControl isInvalid={!!errors.end}>
          <FormLabel>Fecha de finalización</FormLabel>
          <Input
            variant='normal'
            type='datetime-local'
            {...register('end')}
          />
        </FormControl>
        <FormControl isInvalid={!!errors.ticketLink}>
          <FormLabel>Link para comprar boletos</FormLabel>
          <Input variant='normal' type='text' {...register('ticketLink')} />
        </FormControl>
        <FormControl isInvalid={!!errors.locationName} isRequired>
          <FormLabel>Ubicación</FormLabel>
          <Input variant='normal' type='text' {...register('locationName')} />
        </FormControl>
        <FormControl isInvalid={!!errors.published}>
          <FormLabel htmlFor='published'>Publicado?</FormLabel>
          <Switch id='published' {...register('published')} />
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.categories}>
          <FormLabel>Categorías</FormLabel>
          <Controller
            name='categories'
            control={control}
            rules={{ required: true }}
            defaultValue={[]}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={options}
                placeholder='Selecciona una o varias categorías'
                useBasicStyles
                variant='filled'
              />
            )}
          />
        </FormControl>
        <FormControl isInvalid={!!errors.flyer} isRequired>
          <FormLabel htmlFor='flyer'>Flyer</FormLabel>
          <HStack>
            <Button
              leftIcon={<FaCloudUploadAlt />}
              variant='alt'
              onClick={() => {
                uploadInputClickRef.current && uploadInputClickRef.current.click()
              }}
            >
              Elegir imagen
            </Button>
            {selectedFile && <Text>{truncate(selectedFile[0]?.name, { length: 20 })}</Text>}
          </HStack>
          <Input
            id='flyer'
            type='file'
            accept='image/*'
            display='none'
            ref={el => {
              uploadInputClickRef.current = el
              uploadInputRef(el)
            }}
            {...uploadInputProps}
          />
        </FormControl>
        <Button
          alignSelf='end'
          type='submit'
          variant='alt'
          leftIcon={<FaSave />}
        >
          Guardar
        </Button>
      </VStack>
    </chakra.form>
  )
}

export default AddEventForm
