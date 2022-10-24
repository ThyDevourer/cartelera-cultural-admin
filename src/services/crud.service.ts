import { pickBy } from 'lodash'
import { Request, Response } from '../types/interfaces'
import { parseQueryParams } from '../utils/func'
import { APIError } from '../utils/error'
import { API_URL } from '../utils/constants'
import { refreshToken } from '../services/auth.service'

export const crud = async <TReq extends {}, TRes>(
  request: Request<TReq>,
  tokenUpdater?: (token: string) => void
): Promise<Response<TRes>> => {
  const { method, meta, payload, endpoint } = request
  const headers: HeadersInit = {}
  if (meta?.token) {
    headers.Authorization = `Bearer ${meta.token}`
  }
  const options: RequestInit = {
    method,
    headers,
    credentials: 'include'
  }
  if (payload) {
    if (payload instanceof FormData) {
      options.body = payload
    } else {
      options.body = JSON.stringify(pickBy(payload, value => {
        return value !== null && value !== undefined && value !== ''
      }))
      headers['Content-Type'] = 'application/json'
    }
  }
  let query = parseQueryParams({
    filters: meta?.filters,
    limit: meta?.limit,
    skip: meta?.skip,
    sort: meta?.sort
  })
  if (query) {
    query = `?${query}`
  }
  const origRequest = () => fetch(`${API_URL}/${endpoint}${query}`, options)
  const res = await origRequest()
  const data: Response<TRes> = await res.json()
  if (!res.ok) {
    if (data.meta.message.includes('expired')) {
      const newToken = await refreshToken()
      if (tokenUpdater) {
        tokenUpdater(newToken.data)
      }
      headers.Authorization = `Bearer ${newToken.data}`
      const newRes = await origRequest()
      const newData: Response<TRes> = await newRes.json()
      if (!newRes.ok) {
        throw new APIError(newToken.meta.message, res.status)
      }
      return newData
    } else {
      throw new APIError(data.meta.message, res.status)
    }
  }
  return data
}
