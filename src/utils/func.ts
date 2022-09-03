import qs from 'qs'

interface ParseQueryParamsParams {
  filters?: any
  limit?: number
  skip?: number
}

export const parseQueryParams = ({ filters, limit, skip }: ParseQueryParamsParams) => {
  const parseFilters = (filters: any) => {
    const result: any = {}
    Object.entries(filters).forEach(([k, v]) => {
      if (v) {
        if (typeof v === 'string' || v instanceof Array) {
          if (v !== 'all') {
            result[k] = v
          }
        } else if (typeof v === 'object') {
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
  return qs.stringify(query)
}
