import { ICategory } from '../types/interfaces'

const API_URL = import.meta.env.VITE_API_URL

export const findCategories = async (): Promise<ICategory[]> => {
  const res = await fetch(`${API_URL}/categories`)
  if (!res.ok) throw new Error('Error de conexión, intente más tarde')
  const data: ICategory[] = await res.json()
  return data
}
