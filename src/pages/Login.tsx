import {
  Flex,
  Heading,
  FormControl,
  Input,
  Button,
  Link,
  Text,
  chakra
} from '@chakra-ui/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { ILogin } from '../types/interfaces'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      touchedFields
    }
  } = useForm<ILogin>({
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const { login, loginIsLoading: isLoading } = useAuth()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    try {
      const { username, password } = data
      await login({ username, password })
      navigate('/', { replace: true })
    } catch (e: any) {
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
            isLoading={isLoading}
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
