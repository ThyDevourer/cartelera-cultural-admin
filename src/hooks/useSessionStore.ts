import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { IUser } from '../types/interfaces'

interface UserState extends IUser {
  token?: string
}

interface SessionState {
  user: UserState | null
  setUser: (user: UserState | null) => void
}

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user })
      }),
      { name: 'session' }
    ),
    { name: 'session' }
  )
)
