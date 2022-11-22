import { useRef, Fragment } from 'react'
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  Button,
  VStack,
  Switch,
  chakra,
  HStack,
  Text,
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
import {
  FaCloudUploadAlt,
  FaSave,
  FaTrash,
  FaPlus
} from 'react-icons/fa'
import { truncate } from 'lodash'
import { Select } from 'chakra-react-select'
import { AddEventPayload, IEvent } from '../../types/interfaces'
import { useCategories } from '../../hooks/useCategories'

type FormValues = Omit<IEvent, 'active' | 'flyer' | 'categories'> & {
  flyer: FileList
  categories: { label: string, value: string }[]
}

interface Props {
  onSubmit: (event: AddEventPayload) => void
  onClose: () => void
  getImageUrl: (image: FileList) => Promise<string>
}

const schema = object({
  title: nonempty(string()),
  description: nonempty(string()),
  flyer: instance(FileList),
  dates: array(object({
    start: nonempty(string()),
    end: optional(refine(string(), 'isAfterStart', (value, { branch }) => {
      if (dayjs(value).isValid()) {
        console.log(branch)
        return dayjs(value).isAfter(branch[0].start)
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

const AddEventForm = ({ onClose, onSubmit, getImageUrl }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {
      errors
    }
  } = useForm<FormValues>({
    resolver: superstructResolver(schema),
    defaultValues: {
      dates: [
        { start: '', end: '' }
      ]
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
  const { rows: categories } = useCategories()
  const options = categories.map(category => ({ label: category.name, value: category._id }))

  const submitHandler: SubmitHandler<FormValues> = async (data) => {
    const { flyer, categories: cats, ...rest } = data
    const imgUrl = await getImageUrl(flyer)
    onSubmit({
      ...rest,
      categories: cats.map(cat => cat.value),
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
                      {...register(`dates.${index}.start` as const)}
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
