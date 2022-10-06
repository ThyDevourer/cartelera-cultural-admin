import { useToast } from '@chakra-ui/react'
import { useState, useCallback, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { crud } from '../services/crud.service'
import { useAuth } from './useAuth'
import {
  IEvent,
  ICategory,
  EventFilters,
  Response,
  FilterShape,
  AddEventPayload,
  EditEventPayload
} from '../types/interfaces'
import { debounce } from 'lodash'
import { APIError } from '../utils/error'
import { getImageUrl as uploadImage } from '../utils/func'

const useEvents = () => {
  const toast = useToast()
  const client = useQueryClient()
  const { user, logout } = useAuth()
  const token = user?.token as string
  const [filters, setFilters] = useState<EventFilters>({
    title: '',
    description: '',
    published: 'all',
    ticketLink: 'all',
    start: {
      lower: '',
      upper: ''
    },
    end: {
      lower: '',
      upper: ''
    }
    // createdBy: '',
    // categories: [],
  })
  const filterInputs: FilterShape[] = [
    {
      name: 'Título',
      field: 'title'
    },
    {
      name: 'Descripción',
      field: 'description'
    },
    {
      name: 'Link para comprar boletos?',
      field: 'ticketLink',
      type: 'select',
      placeholder: 'Selecciona una opción',
      options: [
        { name: 'Todos', value: 'all' },
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]
    },
    {
      name: 'Inicia entre',
      field: 'start.lower',
      type: 'datetime-local'
    },
    {
      name: 'Y',
      field: 'start.upper',
      type: 'datetime-local'
    },
    {
      name: 'Termina entre',
      field: 'end.lower',
      type: 'datetime-local'
    },
    {
      name: 'Y',
      field: 'end.upper',
      type: 'datetime-local'
    },
    {
      name: '¿Mostrar eliminados?',
      field: 'showDeleted',
      type: 'select',
      options: [
        { name: 'No', value: false },
        { name: 'Si', value: true }
      ]
    }
  ]
  const [limit, setLimit] = useState(20)
  const [skip, setSkip] = useState(0)
  const [sort, setSort] = useState('start')
  const { status, data } = useQuery(['events', { filters, limit, skip, sort }], async () => {
    const res = await crud<{}, IEvent[]>({
      method: 'GET',
      endpoint: 'events',
      meta: {
        filters,
        limit,
        skip,
        sort
      }
    })
    return res
  })

  const { data: totalData } = useQuery(['events', 'total'], async () => {
    const res = await crud<{}, number>({
      method: 'GET',
      endpoint: 'events/count'
    })
    return res
  })

  const { mutate: addEvent } = useMutation({
    mutationFn: async (event: AddEventPayload) => {
      const res = await crud<AddEventPayload, IEvent>({
        method: 'POST',
        endpoint: 'events',
        payload: event,
        meta: {
          token
        }
      })
      return res
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
    },
    onSuccess: () => {
      client.invalidateQueries(['events'])
    }
  })

  const { mutate: updateEvent } = useMutation({
    mutationFn: async (event: EditEventPayload) => {
      const res = await crud<
        EditEventPayload,
        Omit<IEvent, 'categories'> & { categories: ICategory[] }
        >({
          method: 'PUT',
          endpoint: `events/${event._id}`,
          payload: event,
          meta: {
            token
          }
        })
      return res
    },
    onSuccess: ({ data: event }) => {
      const prevEvents = client.getQueryData<Response<IEvent[]>>(['events', {
        filters,
        limit,
        skip,
        sort
      }])
      if (prevEvents) {
        const newEvents = [...prevEvents.data]
        newEvents[newEvents.findIndex(e => e._id === event._id)] = {
          ...event,
          categories: event.categories.map(category => category._id)
        }
        client.setQueryData(['events', { filters, limit, skip, sort }], {
          ...prevEvents,
          data: newEvents
        })
        client.setQueryData(['events', event._id], event)
      }
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

  const { mutate: deleteEvent } = useMutation({
    mutationFn: async (_id: string) => {
      const res = await crud<string, null>({
        method: 'DELETE',
        endpoint: `events/${_id}`,
        meta: {
          token
        }
      })
      return res
    },
    onMutate: async (_id) => {
      await client.cancelQueries(['events'])
      const prevEvents = client.getQueryData<Response<IEvent[]>>(['events', { filters, limit, skip, sort }])
      if (prevEvents) {
        client.setQueryData(['events', { filters, limit, skip, sort }], {
          data: [...prevEvents.data.filter(event => event._id !== _id)],
          meta: {
            ...prevEvents.meta,
            count: count - 1
          }
        })
      }
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
      if (context?.prevEvents) {
        client.setQueryData<IEvent[]>(['events', { filters, limit, skip, sort }], context.prevEvents)
      }
    }
  })

  const rows = data?.data ?? []
  const count = totalData?.data ?? 0

  const handleFilterChange = useCallback(debounce((value: any, type: string) => {
    switch (type) {
      case 'title':
        setFilters({ ...filters, title: value })
        break
      case 'description':
        setFilters({ ...filters, description: value })
        break
      case 'start.lower':
        setFilters(prev => ({ ...prev, start: { ...prev.start, lower: value } }))
        break
      case 'start.upper':
        setFilters(prev => ({ ...prev, start: { ...prev.start, upper: value } }))
        break
      case 'end.lower':
        setFilters(prev => ({ ...prev, end: { ...prev.end, lower: value } }))
        break
      case 'end.upper':
        setFilters(prev => ({ ...prev, end: { ...prev.end, upper: value } }))
        break
      case 'ticketLink':
        setFilters(prev => ({ ...prev, ticketLink: value !== 'all' ? value : null }))
        break
      case 'showDeleted':
        setFilters(prev => ({ ...prev, showDeleted: value === 'true' }))
    }
  }, 300), [])

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

  const toggleSort = (sortOperator: string) => {
    setSort((prevSort) => {
      if (prevSort === `-${sortOperator}` || prevSort !== sortOperator) {
        return sortOperator
      }
      return `-${sortOperator}`
    })
  }

  const getImageUrl = async (image: FileList) => {
    try {
      const url = await uploadImage(image, token)
      return url
    } catch (err) {
      if (err instanceof Error) {
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
      return ''
    }
  }

  return {
    status,
    rows,
    filters,
    setFilters,
    limit,
    setLimit,
    skip,
    setSkip,
    addEvent,
    updateEvent,
    deleteEvent,
    count,
    handleFilterChange,
    filterInputs,
    page,
    maxPage,
    setPage,
    lowerShown,
    upperShown,
    sort,
    toggleSort,
    getImageUrl
  }
}

export default useEvents

export const useEvent = (id: string) => {
  const toast = useToast()
  const { user, logout } = useAuth()
  const token = user?.token as string
  const client = useQueryClient()
  const { status, data } = useQuery(['events', id], async () => {
    const res = await crud<string, IEvent & { categories: ICategory[] }>({
      method: 'GET',
      endpoint: `events/${id}`,
      meta: {
        token
      }
    })
    return res
  })

  const { mutate: togglePublished } = useMutation({
    mutationFn: async () => {
      const { published } = data?.data as IEvent
      const res = await crud<{ published: boolean }, IEvent>({
        method: 'PUT',
        endpoint: `events/${id}`,
        payload: { published: !published },
        meta: {
          token
        }
      })
      return res
    },
    onSuccess: async event => {
      await client.cancelQueries(['events'])
      client.setQueryData(['events', id], event)
      const description = event.data.published
        ? 'El evento se ha publicado correctamente'
        : 'El evento se ha convertido en borrador correctamente'
      toast({
        title: '¡Éxito!',
        description,
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

  return {
    status,
    data,
    togglePublished
  }
}
