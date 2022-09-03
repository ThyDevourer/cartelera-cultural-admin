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
import { VerifyPayload } from '../types/interfaces'

const Verify = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors, touchedFields
    }
  } = useForm<VerifyPayload>({
    defaultValues: {
      code: ''
    }
  })
  const verify = useSessionStore(state => state.verify)
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

  const onSubmit: SubmitHandler<VerifyPayload> = async (data) => {
    try {
      await verify(data.code)
      toast({
        title: '¡Tu cuenta se ha verificado con éxito!',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      navigate('/', { replace: true })
    } catch (e: any) {
      setError(e)
      reset()
    }
  }

  return (
    <Flex h='100vh' align='center' justify='center'>
      <Flex p={12} direction='column' background='gray.700' rounded={6}>
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
              variant='filled'
              mb={6}
            />
          </FormControl>
          <Button w='full' colorScheme='purple' type='submit'>Verificar cuenta</Button>
        </chakra.form>
      </Flex>
    </Flex>
  )
}

export default Verify
