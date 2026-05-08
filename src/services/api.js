import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// API Base URL - Update this based on your deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - logout user
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
}

// Students API
export const studentsAPI = {
  list: (params) => api.get('/students/list', { params }),
  get: (id) => api.get(`/students/${id}`),
  register: (data) => api.post('/students/register', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
}

// Courses API
export const coursesAPI = {
  list: () => api.get('/courses/list'),
  get: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses/create', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
}

// Lessons API
export const lessonsAPI = {
  list: (params) => api.get('/lessons/list', { params }),
  schedule: (data) => api.post('/lessons/schedule', data),
  update: (id, data) => api.put(`/lessons/${id}`, data),
  cancel: (id) => api.delete(`/lessons/${id}`),
}

// Payments API
export const paymentsAPI = {
  list: (params) => api.get('/payments/list', { params }),
  record: (data) => api.post('/payments/record', data),
  get: (id) => api.get(`/payments/${id}`),
}

// Messages API
export const messagesAPI = {
  list: (params) => api.get('/messages/list', { params }),
  send: (data) => api.post('/messages/send', data),
  broadcast: (data) => api.post('/messages/broadcast', data),
}

// Instructors API
export const instructorsAPI = {
  list: () => api.get('/instructors/list'),
}

// Vehicles API
export const vehiclesAPI = {
  list: () => api.get('/vehicles/list'),
}

// Dashboard API
export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
}

// Reports API
export const reportsAPI = {
  generate: (data) => api.post('/reports/generate', data),
}

export default api
