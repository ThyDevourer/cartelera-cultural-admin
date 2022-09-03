import { encode } from 'js-base64'
import {
  LoginResponse,
  LoginPayload,
  SignupPayload,
  IUser,
  SuccessResponse,
  VerifyPayload
} from '../types/interfaces'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const login = async ({ username, password }: LoginPayload) => {
  const auth = encode(`${username}:${password}`)
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`
    }
  })
  if (!res.ok) throw new Error('Error al iniciar sesión')
  const data: LoginResponse = await res.json()
  return data
}

export const signup = async (payload: SignupPayload) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Error al registrar usuario')
  const data: IUser = await res.json()
  return data
}

export const verify = async (payload: VerifyPayload) => {
  const res = await fetch(`${API_URL}/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Error al verificar cuenta')
  const data: IUser = await res.json()
  return data
}

export const resendVerification = async (_id: string) => {
  const res = await fetch(`${API_URL}/auth/resend-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ _id })
  })
  if (!res.ok) {
    throw new Error(`Error al enviar correo de verificación: ${res.body}`)
  }
  const data: SuccessResponse = await res.json()
  return data
}
