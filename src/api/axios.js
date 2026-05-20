import axios from 'axios'
import { getUser } from '../utiles/auth'
import { getCurrentUserAccess, getCurrentUserFacultyId } from '../utiles/vicedecanos'
import { cursoSeleccionado, anioSeleccionado } from '../store/context'
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const userHeaderRoutes = [
  /^\/?ppa\/designar$/,
  /^\/?ppa\/ratificar$/,
  /^\/?ppa\/desnombrar$/,
  /^\/?alumno-ayudante\/designar$/,
  /^\/?alumno-ayudante\/ratificar\/[^/]+$/,
  /^\/?alumno-ayudante\/desnombrar\/[^/]+$/,
  /^\/?documentos\/historial$/,
  /^\/?documentos\/historial-aa$/,
  /^\/?export\/.+$/,
]

function shouldSendUserHeader(config) {
  const method = config.method?.toLowerCase()
  const url = config.url?.split('?')[0] ?? ''

  return ['get', 'post'].includes(method) && userHeaderRoutes.some(route => route.test(url))
}

api.interceptors.request.use(config => {
  const user = getUser()

  if (user?.username && shouldSendUserHeader(config)) {
    config.headers['X-User'] = user.username
  }

  const facultyId = getCurrentUserFacultyId()
  const currentAccess = getCurrentUserAccess()
  const departmentId = currentAccess?.role === 'jefe_departamento'
    ? currentAccess.departmentId
    : null

  if (facultyId) {
    config.headers['X-Facultad'] = facultyId
    if (departmentId) {
      config.headers['X-Departamento'] = departmentId
    }

    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...(config.params ?? {}),
        facultad_id: facultyId,
        id_facultad: facultyId,
        ...(departmentId ? {
          departamento_id: departmentId,
          id_departamento: departmentId,
        } : {}),
      }
    }

    if (['post', 'put', 'patch'].includes(config.method?.toLowerCase()) && config.data instanceof FormData === false) {
      config.data = {
        ...(config.data ?? {}),
        facultad_id: facultyId,
        id_facultad: facultyId,
        ...(departmentId ? {
          departamento_id: departmentId,
          id_departamento: departmentId,
        } : {}),
      }
    }
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
