import axios from 'axios'

const timeout = Number(import.meta.env.VITE_API_TIMEOUT_MS || 12000)
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api', timeout })

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('arena-research-auth-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject({ status: error.response?.status || 0, message: error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'The request timed out. Please try again.' : 'Unable to reach Arena Research.') }),
)

export const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false'
