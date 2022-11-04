import { useState, useCallback, ChangeEvent, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { capitalize, debounce } from 'lodash'
import { useAuth } from './useAuth'
import { crud } from '../services/crud.service'
import { IUser, Response, FilterShape, UserFilters } from '../types/interfaces'
import { roles } from '../utils/constants'
import { APIError } from '../utils/error'

export const useUsers = () => {
  const toast = useToast()
  const { user, logout, setToken } = useAuth()
  const token = user?.token as string

  const [filters, setFilters] = useState<UserFilters>({
    name: '',
    lastName: '',
    username: '',
    email: '',
    role: [],
    active: 'all',
    verified: 'all',
    registeredAt: '',
    lastLogin: ''
  })
  const filterInputs: FilterShape[] = [
    {
      name: 'Usuario',
      field: 'username'
    },
    {
      name: 'Nombre',
      field: 'name'
    },
    {
      name: 'Apellido',
      field: 'lastName'
    },
    {
      name: 'Correo',
      field: 'email'
    },
    {
      name: 'Roles',
      field: 'role',
      type: 'multi',
      options: roles.map(role => ({ name: capitalize(role), value: role }))
    }
  ]
  // TODO: refactor this function to make it type-safe
  const handleFilterChange = useCallback(
    debounce(
      (event: ChangeEvent<any> | readonly Record<string, string>[], type: string) => {
        let value: any
        if (event instanceof Array) {
          value = event
        } else {
          value = event.target.value
        }
        switch (type) {
          case 'username':
            setFilters(prev => ({ ...prev, username: value }))
            break
          case 'name':
            setFilters(prev => ({ ...prev, name: value }))
            break
          case 'lastName':
            setFilters(prev => ({ ...prev, lastName: value }))
            break
          case 'email':
            setFilters(prev => ({ ...prev, email: value }))
            break
          case 'role':
            setFilters(prev => ({ ...prev, role: value.map((role: any) => role.value) }))
            break
        }
      },
      300
    ),
    []
  )

  const [limit, setLimit] = useState(20)
  const [skip, setSkip] = useState(0)

  const [sort, setSort] = useState('username')
  const toggleSort = (sortOperator: string) => {
    setSort(prevSort => {
      if (prevSort === `-${sortOperator}` || prevSort !== sortOperator) {
        return sortOperator
      }
      return `-${sortOperator}`
    })
  }

  const { status, data } = useQuery(['users', { filters, limit, skip, sort }], async () => {
    const res = await crud<{}, IUser[]>({
      method: 'GET',
      endpoint: 'users',
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

  const { data: totalData } = useQuery(['users', 'total'], async () => {
    const res = await crud<{}, number>({
      method: 'GET',
      endpoint: 'users/count'
    })
    return res
  })

  const count = totalData?.data ?? 0

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

  const client = useQueryClient()

  const { mutate: addUser } = useMutation({
    mutationFn: async (user: IUser) => {
      const res = await crud<IUser, IUser>({
        method: 'POST',
        endpoint: 'users',
        payload: user,
        meta: {
          token
        }
      }, setToken)
      return res
    },
    onSuccess: async ({ data: user }) => {
      await client.invalidateQueries(['users'])
      toast({
        title: '¡Éxito!',
        description: `Usuario ${user.username} creado correctamente`,
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    },
    onError: (err: Error) => {
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
    }
  })

  const { mutate: editUser } = useMutation({
    mutationFn: async (user: IUser) => {
      const res = await crud<IUser, IUser>({
        method: 'PUT',
        endpoint: `users/${user._id}`,
        payload: user,
        meta: {
          token
        }
      }, setToken)
      return res
    },
    onSuccess: ({ data: user }) => {
      const prevUsers = client.getQueryData<Response<IUser[]>>(['users', { filters, limit, skip, sort }])
      if (prevUsers) {
        const newUsers = [...prevUsers.data]
        newUsers[newUsers.findIndex(u => u._id === user._id)] = user
        client.setQueryData(['users', { filters, limit, skip, sort }], {
          ...prevUsers,
          data: newUsers
        })
        client.setQueryData(['users', user._id], user)
      }
      toast({
        title: '¡Éxito!',
        description: `Usuario ${user.username} editado correctamente`,
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    },
    onError: (err: Error) => {
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
    }
  })

  const { mutate: deleteUser } = useMutation({
    mutationFn: async (_id: string) => {
      const res = await crud<string, null>({
        method: 'DELETE',
        endpoint: `users/${_id}`,
        meta: {
          token
        }
      }, setToken)
      return res
    },
    onSuccess: async () => {
      await client.invalidateQueries(['users'])
      toast({
        title: '¡Éxito!',
        description: 'Usuario eliminado correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    },
    onError: (err: Error) => {
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
    }
  })

  const getUser = async (id: string) => {
    const cachedUser = client.getQueryData<Response<IUser>>(['users', id])
    if (cachedUser) {
      return cachedUser.data
    }
    const { data: user } = await client.fetchQuery(['users', id], async () => {
      const res = await crud<string, IUser>({
        method: 'GET',
        endpoint: `users/${id}`,
        meta: {
          token
        }
      }, setToken)
      return res
    })
    return user
  }

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
    sort,
    toggleSort,
    count,
    page,
    maxPage,
    setPage,
    lowerShown,
    upperShown,
    addUser,
    editUser,
    deleteUser,
    getUser
  }
}
