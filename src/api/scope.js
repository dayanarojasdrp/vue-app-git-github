import { getUser } from '../utiles/auth'
import { getCurrentUserAccess, getCurrentUserFacultyId } from '../utiles/vicedecanos'

export function getScopeValues() {
  const user = getUser()
  const facultyId = getCurrentUserFacultyId()
  const access = getCurrentUserAccess()
  const departmentId = access?.role === 'jefe_departamento'
    ? access.departmentId
    : null

  return {
    username: user?.username ?? null,
    facultyId,
    departmentId,
  }
}

export function getScopeHeaders() {
  const { username, facultyId, departmentId } = getScopeValues()
  const headers = {}

  if (username) headers['X-User'] = username
  if (facultyId) headers['X-Facultad'] = facultyId
  if (departmentId) headers['X-Departamento'] = departmentId

  return headers
}

export function getScopePayload() {
  const { facultyId, departmentId } = getScopeValues()

  return {
    ...(facultyId ? {
      facultad_id: facultyId,
      id_facultad: facultyId,
    } : {}),
    ...(departmentId ? {
      departamento_id: departmentId,
      id_departamento: departmentId,
    } : {}),
  }
}

export function withScopeParams(params = {}) {
  return {
    ...params,
    ...getScopePayload(),
  }
}

export function withScopeBody(data = {}) {
  return {
    ...data,
    ...getScopePayload(),
  }
}
