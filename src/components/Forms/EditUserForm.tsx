import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  chakra,
  Select,
  Switch
} from '@chakra-ui/react'
import {
  useForm,
  SubmitHandler
} from 'react-hook-form'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import {
  object,
  string,
  nonempty,
  pattern,
  enums,
  boolean,
  refine
} from 'superstruct'
import { FaSave } from 'react-icons/fa'
import { IUser } from '../../types/interfaces'
import { emailRegex, roles } from '../../utils/constants'
import { capitalize } from 'lodash'

const schema = object({
  username: nonempty(string()),
  password: refine(string(), 'passwordLength', value => (
    value.length === 0 || value.length > 8
  )),
  name: string(),
  lastName: string(),
  email: pattern(string(), emailRegex),
  role: enums(roles),
  verified: boolean()
})

type UserPayload = IUser & { password: string }

interface Props {
  onClose: () => void
  onSubmit: (category: UserPayload) => void
  user: IUser
}

const AddCategoryForm = ({ onClose, onSubmit, user }: Props) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<UserPayload>({
    resolver: superstructResolver(schema),
    defaultValues: {
      username: user.username,
      name: user.name,
      lastName: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      password: ''
    }
  })

  const submitHandler: SubmitHandler<UserPayload> = async (data) => {
    onSubmit({ ...data, _id: user._id })
    onClose()
  }

  return (
    <chakra.form onSubmit={handleSubmit(submitHandler)}>
      <VStack pb={4}>
        <FormControl isInvalid={!!errors.username} pb={4}>
          <FormLabel>Usuario</FormLabel>
          <Input variant='normal' type='text' {...register('username')} />
        </FormControl>
        <FormControl isInvalid={!!errors.password} pb={4}>
          <FormLabel>Contraseña</FormLabel>
          <Input variant='normal' type='password' {...register('password')} />
        </FormControl>
        <FormControl isInvalid={!!errors.name} pb={4}>
          <FormLabel>Nombre</FormLabel>
          <Input variant='normal' type='text' {...register('name')} />
        </FormControl>
        <FormControl isInvalid={!!errors.lastName} pb={4}>
          <FormLabel>Apellido</FormLabel>
          <Input variant='normal' type='text' {...register('lastName')} />
        </FormControl>
        <FormControl isInvalid={!!errors.email} pb={4}>
          <FormLabel>Correo</FormLabel>
          <Input variant='normal' type='text' {...register('email')} />
        </FormControl>
        <FormControl isInvalid={!!errors.role} pb={4}>
          <FormLabel>Rol</FormLabel>
          <Select variant='normal' {...register('role')}>
            {roles.map(role => <option key={role} value={role}>{capitalize(role)}</option>)}
          </Select>
        </FormControl>
        <FormControl isInvalid={!!errors.verified} pb={4}>
          <FormLabel htmlFor='verified'>Verificado?</FormLabel>
          <Switch id='verified' {...register('verified')} />
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
