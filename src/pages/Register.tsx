import {
  Flex,
  Heading,
  FormControl,
  Input,
  Button,
  chakra
} from '@chakra-ui/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { object, string, nonempty, refine } from 'superstruct'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ISignup } from '../types/interfaces'
import { emailRegex } from '../utils/constants'

type FormValues = ISignup & { repeat: string }

const schema = object({
  name: nonempty(string()),
  lastName: nonempty(string()),
  username: nonempty(string()),
  email: refine(string(), 'email', value => emailRegex.test(value)),
  password: nonempty(string()),
  repeat: refine(string(), 'repeat', (value, { branch }) => value === branch[0].password)
})

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      touchedFields
    }
  } = useForm<FormValues>({
    resolver: superstructResolver(schema)
  })
  const { signup, signupIsLoading: isLoading } = useAuth()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await signup(data)
      navigate('/verify', { replace: true })
    } catch (e) {
      reset()
    }
  }

  return (
    <Flex h='100vh' align='center' justify='center'>
      <Flex p={12} direction='column' background='bg.alt' borderRadius='xl'>
        <Heading pb={6}>Regístrate</Heading>
        <chakra.form
          onSubmit={handleSubmit(onSubmit)}
          mb={4}
        >
          <FormControl isInvalid={touchedFields.name && !!errors.name}>
            <Input
              {...register('name')}
              placeholder='Nombre'
              variant='normal'
              mb={2}
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.lastName && !!errors.lastName}>
            <Input
              {...register('lastName')}
              placeholder='Apellido'
              variant='normal'
              mb={2}
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.username && !!errors.username}>
            <Input
              {...register('username')}
              placeholder='Nombre de Usuario'
              variant='normal'
              mb={2}
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.email && !!errors.email}>
            <Input
              {...register('email')}
              placeholder='Email'
              variant='normal'
              mb={2}
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.password && !!errors.password}>
            <Input
              {...register('password')}
              placeholder='Contraseña'
              type='password'
              variant='normal'
              mb={2}
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.repeat && !!errors.repeat}>
            <Input
              {...register('repeat')}
              placeholder='Repetir contraseña'
              type='password'
              variant='normal'
              mb={6}
              isDisabled={isLoading}
            />
          </FormControl>
          <Button
            w='full'
            variant='brand'
            type='submit'
            isLoading={isLoading}
          >
            Crear cuenta
          </Button>
        </chakra.form>
      </Flex>
    </Flex>
  )
}

export default Register
