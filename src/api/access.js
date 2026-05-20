import api from './axios'

export const APPLICATION_CODE = 'gestion_roles'

export const ROLE_LABELS = {
  admin: 'Administrador',
  vicedecano_docente: 'Vicedecano docente',
  decano: 'Decano',
  jefe_departamento: 'Jefe de departamento',
}

export const OPERATIONAL_ROLES = ['vicedecano_docente', 'decano', 'jefe_departamento']

export function normalizeAccessItem(item = {}) {
  const role = item.role ?? item.rol ?? ''

  return {
    ...item,
    username: item.username,
    role,
    roleLabel: ROLE_LABELS[role] ?? role,
    facultyId: item.facultad_id ?? item.id_facultad ?? item.facultyId ?? null,
    departmentId: item.departamento_id ?? item.id_departamento ?? item.departmentId ?? null,
    active: item.active ?? item.activo ?? true,
  }
}

export async function getUserAccess(username) {
  const response = await api.get(`/users/${encodeURIComponent(username)}/access`, {
    params: { application: APPLICATION_CODE },
  })

  const data = response.data ?? {}
  const access = Array.isArray(data.access) ? data.access.map(normalizeAccessItem) : []

  return {
    username: data.username ?? username,
    applicationCode: data.application_code ?? APPLICATION_CODE,
    canAccess: Boolean(data.can_access),
    access,
  }
}

export async function listFacultyAccess(facultyId) {
  const response = await api.get('/access', {
    params: {
      application: APPLICATION_CODE,
      facultad_id: facultyId,
    },
  })

  const data = Array.isArray(response.data) ? response.data : response.data?.data ?? []
  return data.map(normalizeAccessItem).filter(item => item.active !== false)
}

export async function assignAccess({ username, role, facultyId, departmentId = null }) {
  const response = await api.post('/access/assign', {
    application_code: APPLICATION_CODE,
    username,
    role,
    facultad_id: facultyId,
    departamento_id: departmentId,
  })

  return response.data
}

export async function transferAdmin(username) {
  const response = await api.post('/access/admin/transfer', {
    application_code: APPLICATION_CODE,
    username,
  })

  return response.data
}

export function getPrimaryOperationalAccess(access = []) {
  return access.find(item => item.active !== false && OPERATIONAL_ROLES.includes(item.role)) ?? null
}

export function hasAdminAccess(access = []) {
  return access.some(item => item.active !== false && item.role === 'admin')
}
