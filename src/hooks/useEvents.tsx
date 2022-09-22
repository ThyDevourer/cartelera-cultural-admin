import shallow from 'zustand/shallow'
import { useToast } from '@chakra-ui/react'
import { useState, useCallback, ChangeEvent, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { crud } from '../services/crud.service'
import { useSessionStore } from './useSessionStore'
import {
  IEvent,
  EventFilters,
  Response,
  FilterShape,
  SubmitParams
} from '../types/interfaces'
import { debounce } from 'lodash'
import { APIError } from '../utils/error'

const useEvents = () => {
  const toast = useToast()
  const client = useQueryClient()
  const { token, logout } = useSessionStore(
    state => ({ token: state.user.token, logout: state.logout }),
    shallow
  )
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

  const addEvent = useMutation({
    mutationFn: async (event: IEvent) => {
      const res = await crud<IEvent, IEvent>({
        method: 'POST',
        endpoint: 'events',
        payload: event,
        meta: {
          token
        }
      })
      return res
    },
    onMutate: async (event) => {
      await client.cancelQueries(['events'])
      const prevEvents = client.getQueryData<Response<IEvent[]>>(['events', { filters, limit, skip, sort }])
      const prevTotalCount = client.getQueryData<Response<number>>(['events', 'total'])
      if (prevEvents && prevTotalCount) {
        client.setQueryData(['events', { filters, limit, skip, sort }], {
          data: [...prevEvents.data, { ...event, _id: null }],
          meta: {
            ...prevEvents.meta,
            count: prevEvents.meta.count + 1
          }
        })
        client.setQueryData(['events', 'total'], {
          ...prevTotalCount,
          data: prevTotalCount.data + 1
        })
      }
      return { prevEvents, prevTotalCount }
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
      if (context?.prevEvents && context?.prevTotalCount) {
        client.setQueryData<IEvent[]>(['events', { filters, limit, skip, sort }], context.prevEvents)
        client.setQueryData<Response<number>>(['events', 'total'], context.prevTotalCount)
      }
    },
    onSuccess: ({ data: event }) => {
      const prevEvents = client.getQueryData<Response<IEvent[]>>(['events', { filters, limit, skip, sort }])
      if (prevEvents) {
        const newEvents = [...prevEvents.data]
        newEvents[newEvents.findIndex(e => e._id === null)] = event
        client.setQueryData<Response<IEvent[]>>(['events', { filters, limit, skip, sort }], {
          ...prevEvents,
          data: newEvents
        })
      }
    }
  })

  const updateEvent = useMutation({
    mutationFn: async (event: IEvent) => {
      const res = await crud<IEvent, IEvent>({
        method: 'PUT',
        endpoint: `events/${event._id}`,
        payload: event,
        meta: {
          token
        }
      })
      return res
    },
    onMutate: async (event) => {
      await client.cancelQueries(['events'])
      const prevEvents = client.getQueryData<Response<IEvent[]>>(['events', { filters, limit, skip, sort }])
      if (prevEvents) {
        const newEvents = [...prevEvents.data]
        newEvents[newEvents.findIndex(e => e._id === event._id)] = event
        client.setQueryData(['events', { filters, limit, skip, sort }], {
          ...prevEvents,
          data: newEvents
        })
      }
      return { prevEvents }
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

  const eventSubmit = async ({ payload, image, action }: SubmitParams<Omit<IEvent, 'flyer'>>) => {
    const formData = new FormData()
    if (image) {
      formData.append('image', image[0])
    }
    const { data: imgUrl } = await crud<FormData, string>({
      method: 'POST',
      endpoint: 'upload/image',
      payload: formData,
      meta: {
        token
      }
    })
    if (action === 'add') {
      addEvent.mutate({ ...payload, flyer: imgUrl })
    } else if (action === 'edit') {
      updateEvent.mutate({ ...payload, flyer: imgUrl })
    }
  }

  const rows = data?.data ?? []
  const count = totalData?.data ?? 0

  const handleFilterChange = useCallback(debounce((event: ChangeEvent<any>, type: string) => {
    const value = event.target.value
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
    eventSubmit,
    page,
    maxPage,
    setPage,
    lowerShown,
    upperShown,
    sort,
    toggleSort
  }
}

export default useEvents
