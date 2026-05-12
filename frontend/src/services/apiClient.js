import axios from 'axios'

/**
 * Configured Axios instance for API requests to the backend.
 * Base URL points to /pastoral context path on backend server.
 */
const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || '/pastoral') + '/listings',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  request => {
    console.debug('[API] Request:', request.method?.toUpperCase(), request.url)
    return request
  },
  error => {
    console.error('[API] Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    console.debug('[API] Response:', response.status, response.config.url)
    return response
  },
  error => {
    if (error.response) {
      console.error('[API] Error Response:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('[API] No Response:', error.request)
    } else {
      console.error('[API] Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient
