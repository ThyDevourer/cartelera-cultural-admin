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

interface FormValues {
  code: string
}

const Verify = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors, touchedFields
    }
  } = useForm<FormValues>({
    defaultValues: {
      code: ''
    }
  })
  const {
    user,
    verify,
    verifyIsLoading: isLoading,
    resendVerification,
    resendIsLoading
  } = useAuth()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await verify({ userId: user?._id as string, ...data })
      navigate('/', { replace: true })
    } catch (e: any) {
      reset()
    }
  }

  return (
    <Flex h='100vh' align='center' justify='center'>
      <Flex p={12} direction='column' background='bg.alt' borderRadius='xl'>
        <Heading pb={6}>Verifica tu cuenta</Heading>
        <chakra.form
          onSubmit={handleSubmit(onSubmit)}
          mb={4}
        >
          <FormControl isInvalid={touchedFields.code && !!errors.code}>
            <Input
              {...register('code', { required: true })}
              placeholder='Código de verificación'
              type='text'
              variant='normal'
              mb={6}
            />
          </FormControl>
          <Button
            w='full'
            variant='brand'
            type='submit'
            isLoading={isLoading}
          >
            Verificar cuenta
          </Button>
        </chakra.form>
        <Button
          variant='link'
          onClick={() => resendVerification(user?._id as string)}
          isLoading={resendIsLoading}
        >
          Enviar un nuevo código
        </Button>
      </Flex>
    </Flex>
  )
}

export default Verify
