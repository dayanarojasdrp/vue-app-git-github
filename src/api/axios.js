import axios from 'axios'
import { getUser } from '../utiles/auth'

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

  return config
})

export default api