import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { IUser } from '../types/interfaces'

interface UserState extends IUser {
  token?: string
}

interface SessionState {
  user: UserState | null
  setUser: (user: UserState | null) => void
  setToken: (token: string) => void
}

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        setUser: (user) => set({ user }),
        setToken: (token) => {
          const user = get().user
          if (user) {
            set({ user: { ...user, token } })
          }
        }
      }),
      { name: 'session' }
    ),
    { name: 'session' }
  )
)
