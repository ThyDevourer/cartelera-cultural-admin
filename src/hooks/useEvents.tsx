import shallow from 'zustand/shallow'
import { useToast } from '@chakra-ui/react'
import { useState, useCallback, ChangeEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { crud } from '../services/crud.service'
import { useSessionStore } from './useSessionStore'
import { IEvent, EventFilters, Response, FilterShape } from '../types/interfaces'
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
  const { status, data } = useQuery(['events', filters], async () => {
    const res = await crud<{}, IEvent[]>({
      method: 'GET',
      endpoint: 'events',
      meta: {
        filters,
        limit,
        skip
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
    onMutate: async (event: IEvent) => {
      await client.cancelQueries(['events', filters])
      await client.cancelQueries(['events', 'total'])
      const prevEvents = client.getQueryData<Response<IEvent[]>>(['events', filters])
      if (prevEvents) {
        client.setQueryData(['events', filters], {
          data: [...prevEvents.data, event],
          meta: {
            ...prevEvents.meta,
            count: count + 1
          }
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
        client.setQueryData<IEvent[]>(['events', filters], context.prevEvents)
      }
    }
  })

  const addEventSubmit = async (payload: Omit<IEvent, 'flyer'>, image: FileList) => {
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
    console.log(imgUrl)
    addEvent.mutate({ ...payload, flyer: imgUrl })
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
    count,
    handleFilterChange,
    filterInputs,
    addEventSubmit
  }
}

export default useEvents
