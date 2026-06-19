import axios from 'axios'
import { getScopeHeaders } from './scope'
import { cursoSeleccionado, anioSeleccionado } from '../store/context'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(config => {
  const isFormData = config.data instanceof FormData

  config.headers = config.headers ?? {}
  Object.assign(config.headers, getScopeHeaders())

  if (isFormData) {
    delete config.headers['Content-Type']
  }

  if (cursoSeleccionado.value) {
    config.headers['X-Curso'] = cursoSeleccionado.value
  }

  if (anioSeleccionado.value) {
    config.headers['X-Anio'] = anioSeleccionado.value
  }

  return config
})

export default api
