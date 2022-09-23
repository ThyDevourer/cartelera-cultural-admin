import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dependencies } from './package.json'

const excluded = [
  'react',
  'react-router-dom',
  'react-dom',
  '@chakra-ui/react'
]

const renderChunks = (deps: Record<string, string>) => {
  const chunks = {}
  Object.keys(deps).forEach(key => {
    if (!excluded.includes(key) && !key.startsWith('@types')) {
      chunks[key] = [key]
    }
  })
  return chunks
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom'],
          ...renderChunks(dependencies)
        }
      }
    }
  }
})
