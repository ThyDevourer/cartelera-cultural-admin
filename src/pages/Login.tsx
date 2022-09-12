import { useEffect } from 'react'
import {
  Flex,
  Heading,
  FormControl,
  Input,
  Button,
  useToast,
  Link,
  Text,
  chakra
} from '@chakra-ui/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useSessionStore } from '../hooks/useSessionStore'
import { LoginPayload } from '../types/interfaces'

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      touchedFields
    }
  } = useForm<LoginPayload>({
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const login = useSessionStore(state => state.login)
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

  const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
    try {
      await login(data.username, data.password)
      navigate('/', { replace: true })
    } catch (e: any) {
      setError(e)
      reset()
    }
  }

  return (
    <Flex h='100vh' align='center' justify='center'>
      <Flex p={12} direction='column' background='bg.alt' borderRadius='xl'>
        <Heading pb={6}>Iniciar sesión</Heading>
        <chakra.form
          onSubmit={handleSubmit(onSubmit)}
          mb={4}
        >
          <FormControl isInvalid={touchedFields.username && !!errors.username}>
            <Input
              {...register('username', { required: true })}
              placeholder='Usuario o Email'
              variant='normal'
              mb={2}
            />
          </FormControl>
          <FormControl isInvalid={touchedFields.password && !!errors.password}>
            <Input
              {...register('password', { required: true })}
              placeholder='Contraseña'
              type='password'
              variant='normal'
              mb={6}
            />
          </FormControl>
          <Button
            variant='brand'
            type='submit'
            w='full'
          >
            Iniciar sesión
          </Button>
        </chakra.form>
        <Text align='center'>¿No tienes cuenta? <Link as={RouterLink} to='/register'>Regístrate</Link></Text>
      </Flex>
    </Flex>
  )
}

export default Login
