import { encode } from 'js-base64'
import {
  ILogin,
  ISignup,
  IUser,
  IVerify,
  Response
} from '../types/interfaces'
import { APIError } from '../utils/error'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// TODO: MAKE THIS INTO A SINGLE SERVICE

export const login = async ({ username, password }: ILogin) => {
  const auth = encode(`${username}:${password}`)
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`
    }
  })
  const data: Response<string> = await res.json()
  if (!res.ok) {
    throw new APIError(data.meta.message, res.status)
  }
  return data
}

export const signup = async (payload: ISignup) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  const data: Response<IUser> = await res.json()
  if (!res.ok) throw new APIError(data.meta.message, res.status)
  return data
}

export const verify = async (payload: IVerify) => {
  const res = await fetch(`${API_URL}/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  const data: Response<IUser> = await res.json()
  if (!res.ok) throw new APIError(data.meta.message, res.status)
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
  const data: Response<null> = await res.json()
  if (!res.ok) throw new APIError(data.meta.message, res.status)
  return data
}
