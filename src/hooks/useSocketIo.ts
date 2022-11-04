import { useEffect } from 'react'
import { useSocketStore } from './useSocketStore'
import shallow from 'zustand/shallow'

export const useSocketIo = () => {
  const {
    connected,
    addListener,
    removeListener,
    removeAllListeners,
    close
  } = useSocketStore(state => ({
    addListener: state.addListener,
    removeListener: state.removeListener,
    removeAllListeners: state.removeAllListeners,
    close: state.close,
    connected: state.connected
  }), shallow)

  useEffect(() => {
    addListener('connect', () => {
      console.log('Socket connected!')
    })
    addListener('error', (err: string) => {
      console.log(`Socket.IO error: ${err}`)
    })
    addListener('connect_error' as any, (err: any) => console.log(err.message))
    addListener('disconnect', reason => {
      console.log(`Socket disconnected: ${reason}`)
    })
  }, [])

  return {
    addListener,
    removeListener,
    connected,
    removeAllListeners,
    close
  }
}
