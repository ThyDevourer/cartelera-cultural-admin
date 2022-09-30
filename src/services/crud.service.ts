import { Request, Response } from '../types/interfaces'
import { parseQueryParams } from '../utils/func'
import { APIError } from '../utils/error'
import { pickBy } from 'lodash'
import { API_URL } from '../utils/constants'

export const crud = async <TReq extends {}, TRes>(request: Request<TReq>): Promise<Response<TRes>> => {
  const { method, meta, payload, endpoint } = request
  const headers: HeadersInit = {}
  if (meta?.token) {
    headers.Authorization = `Bearer ${meta.token}`
  }
  const options: RequestInit = { method, headers }
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
  const res = await fetch(`${API_URL}/${endpoint}${query}`, options)
  const data: Response<TRes> = await res.json()
  if (!res.ok) {
    throw new APIError(data.meta.message, res.status)
  }
  return data
}
