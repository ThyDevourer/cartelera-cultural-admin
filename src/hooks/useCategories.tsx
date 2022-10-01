import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import { useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { crud } from '../services/crud.service'
import { useSessionStore } from './useSessionStore'
import shallow from 'zustand/shallow'
import {
  CategoryFilters,
  ICategory,
  Response,
  FilterShape
} from '../types/interfaces'
import { APIError } from '../utils/error'

export const useCategories = () => {
  const toast = useToast()
  const { token, logout } = useSessionStore(
    state => ({ token: state.user.token, logout: state.logout }),
    shallow
  )
  const client = useQueryClient()
  const [filters, setFilters] = useState<CategoryFilters>({
    name: '',
    showDeleted: false
  })
  const filterInputs: FilterShape[] = [
    {
      name: 'Nombre',
      field: 'name'
    },
    {
      name: 'Mostrar eliminados?',
      field: 'showDeleted',
      type: 'select',
      placeholder: 'Selecciona una opción',
      options: [
        { name: 'No', value: false },
        { name: 'Si', value: true }
      ]
    }
  ]
  const handleFilterChange = useCallback(debounce((value: any, type: string) => {
    switch (type) {
      case 'name':
        setFilters(prev => ({ ...prev, name: value }))
        break
      case 'showDeleted':
        setFilters(prev => ({ ...prev, showDeleted: value === 'true' }))
        break
    }
  }, 300), [])
  const [limit, setLimit] = useState(20)
  const [skip, setSkip] = useState(0)
  const [sort, setSort] = useState('name')
  const { status, data } = useQuery(['categories', { filters, limit, skip, sort }], async () => {
    const res = await crud<{}, ICategory[]>({
      method: 'GET',
      endpoint: 'categories',
      meta: {
        filters,
        limit,
        skip,
        sort
      }
    })
    return res
  })

  const rows = data?.data ?? []

  const { data: totalData } = useQuery(['categories', 'total'], async () => {
    const res = await crud<{}, number>({
      method: 'GET',
      endpoint: 'categories/count'
    })
    return res
  })

  const count = totalData?.data ?? 0

  const { mutate: addCategory } = useMutation({
    mutationFn: async (category: ICategory) => {
      const res = await crud<ICategory, ICategory>({
        method: 'POST',
        endpoint: 'categories',
        payload: category,
        meta: {
          token
        }
      })
      return res
    },
    onMutate: async (category) => {
      await client.cancelQueries(['categories'])
      const prevCategories = client.getQueryData<Response<ICategory[]>>(['categories', { filters, limit, skip, sort }])
      const prevTotalCount = client.getQueryData<Response<number>>(['categories', 'total'])
      if (prevCategories && prevTotalCount) {
        client.setQueryData(['categories', { filters, limit, skip, sort }], {
          data: [...prevCategories.data, { ...category, _id: null }],
          meta: {
            ...prevCategories.meta,
            count: prevCategories.meta.count + 1
          }
        })
        client.setQueryData(['categories', 'total'], {
          ...prevTotalCount,
          data: prevTotalCount.data + 1
        })
      }
      return { prevCategories, prevTotalCount }
    },
    onError: (err: Error, _, context: any) => {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      if (err instanceof APIError) {
        if (err.status === 401) {
          logout()
        }
      }
      if (context?.prevCategories && context?.prevTotalCount) {
        client.setQueryData<Response<ICategory[]>>(['categories', { filters, limit, skip, sort }], context.prevCategories)
        client.setQueryData<Response<number>>(['categories', 'total'], context.prevTotalCount)
      }
    },
    onSuccess: ({ data: category }) => {
      const prevCategories = client.getQueryData<Response<ICategory[]>>(['categories', { filters, limit, skip, sort }])
      if (prevCategories) {
        const newCategories = [...prevCategories.data]
        newCategories[newCategories.findIndex(c => c._id === null)] = category
        client.setQueryData<Response<ICategory[]>>(['categories', { filters, limit, skip, sort }], {
          ...prevCategories,
          data: newCategories
        })
      }
    }
  })

  const { mutate: editCategory } = useMutation({
    mutationFn: async (category: ICategory) => {
      const res = await crud<ICategory, ICategory>({
        method: 'PUT',
        endpoint: `categories/${category._id}`,
        payload: category,
        meta: {
          token
        }
      })
      return res
    },
    onMutate: async (category) => {
      await client.cancelQueries(['categories'])
      const prevCategories = client.getQueryData<Response<ICategory[]>>(['categories', {
        filters,
        limit,
        skip,
        sort
      }])
      if (prevCategories) {
        const newCategories = [...prevCategories.data]
        newCategories[newCategories.findIndex(c => c._id === category._id)] = category
        client.setQueryData(['categories', { filters, limit, skip, sort }], {
          ...prevCategories,
          data: newCategories
        })
      }
      return { prevCategories }
    },
    onError: (err: Error, _, context: any) => {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      if (err instanceof APIError) {
        if (err.status === 401) {
          logout()
        }
      }
      if (context?.prevCategories) {
        client.setQueryData<Response<ICategory[]>>(['categories', {
          filters,
          limit,
          skip,
          sort
        }], context.prevCategories)
      }
    },
    onSuccess: ({ data: category }) => {
      const prevCategories = client.getQueryData<Response<ICategory[]>>(['categories', { filters, limit, skip, sort }])
      if (prevCategories) {
        const newCategories = [...prevCategories.data]
        newCategories[newCategories.findIndex(c => c._id === category._id)] = category
        client.setQueryData<Response<ICategory[]>>(['categories', { filters, limit, skip, sort }], {
          ...prevCategories,
          data: newCategories
        })
      }
    }
  })

  const { mutate: deleteCategory } = useMutation({
    mutationFn: async (_id: string) => {
      const res = await crud<string, null>({
        method: 'DELETE',
        endpoint: `categories/${_id}`,
        meta: {
          token
        }
      })
      return res
    },
    onMutate: async (_id) => {
      await client.cancelQueries(['categories'])
      const prevCategories = client.getQueryData<Response<ICategory[]>>(['categories', {
        filters,
        limit,
        skip,
        sort
      }])
      const prevTotalCount = client.getQueryData<Response<number>>(['categories', 'total'])
      if (prevCategories && prevTotalCount) {
        client.setQueryData(['categories', { filters, limit, skip, sort }], {
          data: [...prevCategories.data.filter(category => category._id !== _id)],
          meta: {
            ...prevCategories.meta,
            count: prevCategories.meta.count - 1
          }
        })
        client.setQueryData(['categories', 'total'], {
          ...prevTotalCount,
          data: prevTotalCount.data - 1
        })
      }
      return { prevCategories, prevTotalCount }
    },
    onError: (err: Error, _, context: any) => {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      if (err instanceof APIError) {
        if (err.status === 401) {
          logout()
        }
      }
      if (context?.prevCategories && context?.prevTotalCount) {
        client.setQueryData<Response<ICategory[]>>(['categories', {
          filters,
          limit,
          skip,
          sort
        }], context.prevCategories)
        client.setQueryData<Response<number>>(['categories', 'total'], context.prevTotalCount)
      }
    }
  })

  const toggleSort = (sortOperator: string) => {
    setSort(prevSort => {
      if (prevSort === `-${sortOperator}` || prevSort !== sortOperator) {
        return sortOperator
      }
      return `-${sortOperator}`
    })
  }

  const [page, setPage] = useState(0)
  const maxPage = Math.ceil(count / limit) - 1
  const lowerShown = (page * limit) + 1
  const upperShown = (page * limit) + rows.length

  useEffect(() => {
    setSkip(limit * page)
  }, [page])

  useEffect(() => {
    if (page > 0) {
      setPage(0)
    }
  }, [filters])

  return {
    status,
    rows,
    filters,
    setFilters,
    filterInputs,
    handleFilterChange,
    limit,
    setLimit,
    skip,
    setSkip,
    count,
    addCategory,
    editCategory,
    deleteCategory,
    page,
    maxPage,
    setPage,
    lowerShown,
    upperShown,
    sort,
    toggleSort
  }
}
