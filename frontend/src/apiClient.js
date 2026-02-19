import axios from 'axios'

// When VITE_API_BASE_URL is not provided, requests are made relative to the dev server
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  withCredentials: true,
})

export { apiClient }

