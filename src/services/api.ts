import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: 'https://demometaway.vps-kinghost.net:8485/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const auth = useAuthStore()

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await auth.refreshAuth()
        return api(originalRequest)
      } catch (refreshError) {
        auth.logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
