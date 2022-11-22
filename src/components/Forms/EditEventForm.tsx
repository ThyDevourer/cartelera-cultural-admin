import { useRef, Fragment } from 'react'
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
  Text,
  Spinner,
  Center,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex
} from '@chakra-ui/react'
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray
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
import { Select } from 'chakra-react-select'
import {
  FaCloudUploadAlt,
  FaSave,
  FaTrash,
  FaPlus
} from 'react-icons/fa'
import { truncate } from 'lodash'
import { EditEventPayload, ICategory, IEvent } from '../../types/interfaces'
import { useCategories } from '../../hooks/useCategories'

type FormValues = Omit<IEvent, '_id' | 'active' | 'flyer' | 'categories'> & {
  flyer: FileList
  categories: { label: string, value: string }[]
}

interface Props {
  onSubmit: (event: EditEventPayload) => void
  onClose: () => void
  getImageUrl: (image: FileList) => Promise<string>
  event: IEvent
}

const schema = object({
  title: nonempty(string()),
  description: nonempty(string()),
  flyer: instance(FileList),
  dates: array(object({
    start: nonempty(string()),
    end: optional(refine(string(), 'isAfterStart', (value, { branch }) => {
      if (dayjs(value).isValid()) {
        return dayjs(value).isAfter(branch[1].start)
      }
      return true
    }))
  })),
  ticketLink: optional(string()),
  locationName: optional(string()),
  published: boolean(),
  categories: nonempty(array(object({
    label: string(),
    value: string()
  })))
})

interface FormProps extends Props {
  categories: ICategory[]
}

const Form = ({ event, onClose, onSubmit, getImageUrl, categories }: FormProps) => {
  const {
    title,
    description,
    dates,
    ticketLink,
    locationName,
    published,
    categories: prevCategories
  } = event

  const options = categories.map(category => ({
    label: category.name,
    value: category._id
  }))
  const initialCategories = prevCategories.map(category => {
    const cat = categories.find(c => c._id === category)
    return { label: cat?.name ?? '', value: cat?._id ?? '' }
  })

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: {
      errors
    }
  } = useForm<FormValues>({
    resolver: superstructResolver(schema),
    defaultValues: {
      title,
      description,
      dates: dates.map(({ start, end }) => ({
        start: dayjs(start).format('YYYY-MM-DDTHH:mm'),
        ...(end && { end: dayjs(end).format('YYYY-MM-DDTHH:mm') })
      })),
      ticketLink: ticketLink ?? '',
      locationName,
      published,
      categories: initialCategories
    }
  })
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'dates'
  })

  const submitHandler: SubmitHandler<FormValues> = async (data) => {
    const { flyer, categories: newCategories, ...rest } = data
    const imgUrl = await getImageUrl(flyer)
    onSubmit({
      ...rest,
      _id: event._id,
      categories: newCategories.map(category => category.value),
      flyer: imgUrl
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
        {fields.map((field, index) => (
          <Fragment key={field.id}>
            <FormControl>
              <FormLabel>{`Fecha ${index + 1}`}</FormLabel>
              <HStack>
                <VStack w='full'>
                  <InputGroup>
                    <Input
                      variant='normal'
                      type='datetime-local'
                      {...register(`dates.${index}.start`)}
                    />
                    <InputRightElement pr={8}>Inicio</InputRightElement>
                  </InputGroup>
                  <InputGroup>
                    <Input
                      variant='normal'
                      type='datetime-local'
                      {...register(`dates.${index}.end` as const)}
                      />
                    <InputRightElement pr={8}>Final</InputRightElement>
                  </InputGroup>
                </VStack>
                {fields.length > 1 && (
                  <IconButton
                    variant='alt'
                    aria-label='Delete date'
                    icon={<FaTrash />}
                    onClick={() => remove(index)}
                    />
                )}
              </HStack>
            </FormControl>
          </Fragment>
        ))}
        <Flex alignItems='center' justifyContent='end' w='full'>
          <Button
            variant='alt'
            onClick={() => append({ start: '', end: '' })}
            leftIcon={<FaPlus />}
          >
            Fecha
          </Button>
        </Flex>
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
            defaultValue={initialCategories}
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
        <FormControl isInvalid={!!errors.flyer}>
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

const EditEventForm = ({ event, onClose, onSubmit, getImageUrl }: Props) => {
  const { rows: categories } = useCategories()
  if (categories.length === 0) {
    return (
      <Center w='full' h='full' mb={4}>
        <Spinner />
      </Center>
    )
  }
  return (
    <Form
      event={event}
      onClose={onClose}
      onSubmit={onSubmit}
      getImageUrl={getImageUrl}
      categories={categories}
    />
  )
}

export default EditEventForm
