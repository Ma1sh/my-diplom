import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Определяем, относится ли запрос к авторизации/регистрации
    const isAuthEndpoint = originalRequest.url?.includes('/auth/jwt/create/') ||
                           originalRequest.url?.includes('/auth/jwt/refresh/') ||
                           originalRequest.url?.includes('/auth/users/')

    // Если ошибка 401, это не повторная попытка и это НЕ запрос логина
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')

        // Если рефреш токена нет, нет смысла делать запрос, сразу выкидываем ошибку
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post('/api/auth/jwt/refresh/', {
          refresh: refreshToken
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)

      } catch (refreshError) {
        // Если обновить токен не удалось - разлогиниваем пользователя
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        // Редиректим на логин ТОЛЬКО если мы сейчас не на странице логина
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    // Показываем глобальные уведомления ТОЛЬКО если это не форма авторизации.
    // (Потому что в LoginPage.vue и RegisterPage.vue у тебя уже есть своя детальная обработка ошибок и свои тосты)
    if (!isAuthEndpoint) {
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail)
      } else if (error.response?.data) {
        try {
          const errors = Object.values(error.response.data).flat()
          errors.forEach(err => {
            if (typeof err === 'string') toast.error(err)
          })
        } catch (e) {
          // Игнорируем ошибки парсинга
        }
      } else {
        toast.error('Произошла ошибка соединения с сервером.')
      }
    }

    // Возвращаем ошибку в компонент
    return Promise.reject(error)
  }
)

export default api