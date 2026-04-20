import axios from 'axios'
import { getUser } from '../utiles/auth'
import { cursoSeleccionado, anioSeleccionado } from '../store/context'
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// 🔥 interceptor
api.interceptors.request.use(config => {
  const user = getUser()

  if (user) {
    config.headers['X-User'] = user.name
  }

  // 👇 AGREGA ESTO
  if (cursoSeleccionado.value) {
    config.headers['X-Curso'] = cursoSeleccionado.value
  }

  if (anioSeleccionado.value) {
    config.headers['X-Anio'] = anioSeleccionado.value
  }

  return config
})

export default api