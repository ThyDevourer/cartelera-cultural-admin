import create from 'zustand'
import { devtools } from 'zustand/middleware'
import io, { type Socket } from 'socket.io-client'
import { API_URL } from '../utils/constants'

type ServerToClientEvents = {
  eventAdded: (eventId: string, userId: string) => void
  eventPublished: (eventId: string, userId: string) => void
  connect: () => void
  error: (err: string) => void
  disconnect: (reason: string) => void
}

interface SocketState {
  socket: Socket<ServerToClientEvents>
  connected: boolean
  addListener: <T extends keyof ServerToClientEvents>(event: T, handler: ServerToClientEvents[T]) => void
  removeListener: (event: keyof ServerToClientEvents) => void
  removeAllListeners: () => void
  close: () => void
}

const socket = io(API_URL)

export const useSocketStore = create<SocketState>()(
  devtools(
    (_, get) => ({
      socket,
      connected: socket.connected,
      addListener: (event, handler: any) => {
        socket.on(event, handler)
      },
      removeListener: event => socket.removeListener(event),
      removeAllListeners: () => socket.removeAllListeners(),
      close: () => get().socket.close()
    }),
    { name: 'socket' }
  )
)
