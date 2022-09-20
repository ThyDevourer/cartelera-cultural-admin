import qs from 'qs'

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
