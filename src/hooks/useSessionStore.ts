import jwtDecode from 'jwt-decode'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { login, signup, verify } from '../services/session'
import { IUser, SignupPayload } from '../types/interfaces'

interface UserState extends IUser {
  _id: string
  token: string
}

interface SessionState {
  isLoggedIn: boolean
  user: UserState
  error: string | null
  setError: (err: Error | null) => void
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  signup: (payload: SignupPayload) => Promise<void>
  verify: (code: string) => Promise<void>
}

const initialUserState: UserState = {
  _id: '',
  name: '',
  lastName: '',
  username: '',
  email: '',
  role: 'normal',
  active: false,
  verified: false,
  lastLogin: '',
  registeredAt: '',
  token: ''
}

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set, get) => ({
        isLoggedIn: false,
        user: initialUserState,
        error: null,
        setError: (err) => {
          if (err === null) {
            set(() => ({ error: null }))
          } else {
            set(() => ({ error: err.message }))
          }
        },
        login: async (username: string, password: string) => {
          try {
            const { token } = await login({ username, password })
            const decodedToken = jwtDecode<IUser>(token)
            const user = { ...decodedToken, token }
            set(() => ({ user, isLoggedIn: true }))
          } catch (e: any) {
            set(() => ({ error: e.message }))
            throw e
          }
        },
        logout: () => set(() => ({
          isLoggedIn: false,
          user: initialUserState
        })),
        signup: async (payload) => {
          try {
            const user = await signup(payload)
            set(() => ({
              user: {
                ...user,
                token: get().user.token
              },
              isLoggedIn: true
            }))
          } catch (e: any) {
            set(() => ({ error: e.message }))
          }
        },
        verify: async (code) => {
          try {
            const user = await verify({ code, userId: get().user._id })
            set({ user: { ...user, token: get().user.token, verified: true } })
          } catch (e: any) {
            set({ error: e.message })
          }
        }
      }),
      { name: 'session' }
    ),
    { name: 'session' }
  )
)
