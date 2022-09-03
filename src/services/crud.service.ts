import { Request, Response } from '../types/interfaces'
import { parseQueryParams } from '../utils/func'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const crud = async <T>(request: Request<T>): Promise<Response<T>> => {
  const { method, meta, payload, endpoint } = request
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  if (meta?.token) {
    headers.Authorization = `Bearer ${meta.token}`
  }
  const options: RequestInit = { method, headers }
  if (payload) {
    options.body = JSON.stringify(payload)
  }
  let query = parseQueryParams({
    filters: meta?.filters,
    limit: meta?.limit,
    skip: meta?.skip
  })
  if (query) {
    query = `?${query}`
  }
  const res = await fetch(`${API_URL}/${endpoint}${query}`, options)
  const data: Response<T> = await res.json()
  if (!res.ok) {
    throw new Error(data.meta.message)
  }
  return data
}
