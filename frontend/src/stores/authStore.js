import { create } from 'zustand'
import { authService } from '../services/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const { data } = await authService.login(email, password)
      const { token, user } = data
      localStorage.setItem('token', token)
      set({ user, token, loading: false })
      return data
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  register: async (name, email, password) => {
    set({ loading: true })
    try {
      const { data } = await authService.register(name, email, password)
      const { token, user } = data
      localStorage.setItem('token', token)
      set({ user, token, loading: false })
      return data
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  fetchProfile: async () => {
    const token = get().token
    if (!token) return

    try {
      const { data } = await authService.getProfile()
      set({ user: data.user })
    } catch (error) {
      // Token may be expired
      get().logout()
    }
  }
}))