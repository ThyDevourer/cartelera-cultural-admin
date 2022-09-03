import { useEffect } from 'react'
import {
  Flex,
  Heading,
  FormControl,
  Input,
  Button,
  useToast,
  chakra
} from '@chakra-ui/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '../hooks/useSessionStore'
import { SignupPayload } from '../types/interfaces'

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      touchedFields
    }
  } = useForm<SignupPayload>({
    defaultValues: {
      name: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    }
  })
  const signup = useSessionStore(state => state.signup)
  const { error, setError } = useSessionStore(state => ({
    error: state.error,
    setError: state.setError
  }))
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }, [error])

  const onSubmit: SubmitHandler<SignupPayload> = async (data) => {
    try {
      await signup(data)
      toast({
        title: 'Te has registrado con éxito!',
        description: `Se ha enviado un código de verificación a ${data.email}`,
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      navigate('/verify', { replace: true })
    } catch (e: any) {
      setError(e)
      reset()
    }
  }

  return (
    <Flex h='100vh' align='center' justify='center'>
      <Flex p={12} direction='column' background='gray.700' rounded={6}>
        <Heading pb={6}>Regístrate</Heading>
        <chakra.form
          onSubmit={handleSubmit(onSubmit)}
          mb={4}
        >
          <FormControl isInvalid={touchedFields.name && !!errors.name}>
            <Input
              {...register('name', { required: true })}
              placeholder='Nombre'
              variant='filled'
              mb={2}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.lastName && !!errors.lastName}>
            <Input
              {...register('lastName', { required: true })}
              placeholder='Apellido'
              variant='filled'
              mb={2}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.username && !!errors.username}>
            <Input
              {...register('username', { required: true })}
              placeholder='Nombre de Usuario'
              variant='filled'
              mb={2}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.email && !!errors.email}>
            <Input
              {...register('email', { required: true })}
              placeholder='Email'
              variant='filled'
              mb={2}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.password && !!errors.password}>
            <Input
              {...register('password', { required: true })}
              placeholder='Contraseña'
              type='password'
              variant='filled'
              mb={6}
            />
          </FormControl>
          <Button w='full' colorScheme='purple' type='submit'>Crear cuenta</Button>
        </chakra.form>
      </Flex>
    </Flex>
  )
}

export default Register
