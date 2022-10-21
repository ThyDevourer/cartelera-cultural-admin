import {
  Flex,
  Heading,
  FormControl,
  Input,
  Button,
  chakra
} from '@chakra-ui/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ISignup } from '../types/interfaces'

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      touchedFields
    }
  } = useForm<ISignup>({
    defaultValues: {
      name: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    }
  })
  const { signup, signupIsLoading: isLoading } = useAuth()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<ISignup> = async (data) => {
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
              {...register('name', { required: true })}
              placeholder='Nombre'
              variant='normal'
              mb={2}
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.lastName && !!errors.lastName}>
            <Input
              {...register('lastName', { required: true })}
              placeholder='Apellido'
              variant='normal'
              mb={2}
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.username && !!errors.username}>
            <Input
              {...register('username', { required: true })}
              placeholder='Nombre de Usuario'
              variant='normal'
              mb={2}
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.email && !!errors.email}>
            <Input
              {...register('email', { required: true })}
              placeholder='Email'
              variant='normal'
              mb={2}
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.password && !!errors.password}>
            <Input
              {...register('password', { required: true })}
              placeholder='Contraseña'
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
