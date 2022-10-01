import qs from 'qs'
import { crud } from '../services/crud.service'

interface ParseQueryParamsParams {
  filters?: any
  limit?: number
  skip?: number
  sort?: string
}

export const parseQueryParams = ({ filters, limit, skip, sort }: ParseQueryParamsParams) => {
  const parseFilters = (filters: any) => {
    const result: any = {}
    Object.entries(filters).forEach(([k, v]) => {
      switch (typeof v) {
        case 'number':
        case 'boolean':
          result[k] = v
          break
        case 'string':
          if (v !== 'all' && v) {
            result[k] = v
          }
          break
        case 'object':
          if (v instanceof Array) {
            result[k] = v
          } else {
            result[k] = parseFilters(filters[k])
          }
      }
    })
    return result
  }
  const query: any = {}
  if (limit) {
    query.limit = limit
  }
  if (skip) {
    query.skip = skip
  }
  if (filters) {
    query.filters = parseFilters(filters)
  }
  if (sort) {
    query.sort = sort
  }
  return qs.stringify(query)
}

export const getImageUrl = async (image: FileList, token: string) => {
  if (image) {
    const formData = new FormData()
    formData.append('image', image[0])
    const { data: imgUrl } = await crud<FormData, string>({
      method: 'POST',
      endpoint: 'upload/image',
      payload: formData,
      meta: {
        token
      }
    })
    return imgUrl
  }
  return ''
}
