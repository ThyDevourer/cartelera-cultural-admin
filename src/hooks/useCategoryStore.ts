import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { findCategories } from '../services/categoryService'
import { ICategory } from '../types/interfaces'

interface CategoryState {
  isLoading: boolean
  categories: ICategory[]
  error: { error: boolean, message: string }
  getCategories: () => Promise<void>
}

export const useCategoryStore = create<CategoryState>()(
  devtools((set) => ({
    isLoading: false,
    categories: [],
    error: { error: false, message: '' },
    getCategories: async () => {
      set(() => ({ isLoading: true }))
      try {
        const categories = await findCategories()
        set(() => ({ categories }))
      } catch (e: any) {
        set(() => ({ error: { error: true, message: e.message } }))
      }
      set(() => ({ isLoading: false }))
    }
  }))
)
