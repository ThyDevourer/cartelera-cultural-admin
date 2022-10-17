import shallow from 'zustand/shallow'
import { useToast } from '@chakra-ui/react'
import jwtDecode from 'jwt-decode'
import { useMutation } from '@tanstack/react-query'
import type { ILogin, IUser, ISignup, IVerify } from '../types/interfaces'
import {
  login as _login,
  signup as _signup,
  verify as _verify,
  logout as _logout,
  resendVerification as _resendVerification
} from '../services/auth.service'
import { useSessionStore } from './useSessionStore'

export const useAuth = () => {
  const {
    user: userState,
    setUser,
    setToken
  } = useSessionStore(state => ({
    user: state.user,
    setUser: state.setUser,
    setToken: state.setToken
  }), shallow)
  const toast = useToast()
  const {
    mutateAsync: login,
    isLoading: loginIsLoading
  } = useMutation({
    mutationFn: (payload: ILogin) => _login(payload),
    onSuccess: ({ data: token }) => {
      const decodedToken = jwtDecode<IUser>(token)
      const user = { ...decodedToken, token }
      setUser(user)
    },
    onError: (error: Error) => {
      if (error.message) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
      throw error
    }
  })
  const {
    mutate: logout,
    isLoading: logoutIsLoading
  } = useMutation({
    mutationFn: () => _logout(),
    onSuccess: () => {
      setUser(null)
      useSessionStore.persist.clearStorage()
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  })
  const {
    mutateAsync: signup,
    isLoading: signupIsLoading
  } = useMutation({
    mutationFn: (payload: ISignup) => _signup(payload),
    onSuccess: ({ data: user }) => {
      setUser(user)
      toast({
        title: '¡Éxito!',
        description: 'Te has registrado correctamente, se envió un código de verificación a tu correo ',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    },
    onError: (error: Error) => {
      if (error.message) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
      throw error
    }
  })
  const {
    mutateAsync: verify,
    isLoading: verifyIsLoading
  } = useMutation({
    mutationFn: (payload: IVerify) => _verify(payload),
    onSuccess: ({ data: token }) => {
      const decodedToken = jwtDecode<IUser>(token)
      const user = { ...decodedToken, token }
      setUser(user)
      toast({
        title: '¡Éxito',
        description: 'Has verificado tu cuenta correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    },
    onError: (error: Error) => {
      if (error.message) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
      throw error
    }
  })
  const {
    mutateAsync: resendVerification,
    isLoading: resendIsLoading
  } = useMutation({
    mutationFn: (_id: string) => _resendVerification(_id),
    onSuccess: () => toast({
      title: '¡Éxito!',
      description: 'Se ha enviado un nuevo código de verificación a tu correo',
      status: 'success',
      duration: 5000,
      isClosable: true
    }),
    onError: (error: Error) => {
      if (error.message) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    }
  })

  return {
    user: userState,
    login,
    loginIsLoading,
    signup,
    signupIsLoading,
    verify,
    verifyIsLoading,
    resendVerification,
    resendIsLoading,
    logout,
    logoutIsLoading,
    setToken
  }
}
