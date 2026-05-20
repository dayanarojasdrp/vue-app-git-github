import api from '../api/axios'
import { getPrimaryOperationalAccess, getUserAccess } from '../api/access'

export async function buildSessionFromAccess(baseUser) {
  const accessResult = await getUserAccess(baseUser.username)
  const access = getPrimaryOperationalAccess(accessResult.access)

  if (!access) return null

  const faculty = await getFacultyById(access.facultyId)
  const department = access.departmentId
    ? await getDepartmentById(access.facultyId, access.departmentId)
    : null

  return {
    name: baseUser.name,
    username: baseUser.username,
    role: access.role,
    roleLabel: access.roleLabel,
    access: accessResult.access,
    facultyId: access.facultyId,
    facultyName: faculty?.nombre ?? baseUser.facultyName ?? null,
    facultyAbbreviation: faculty?.abreviatura ?? baseUser.facultyAbbreviation ?? null,
    departmentId: access.departmentId,
    departmentName: department?.nombre ?? baseUser.departmentName ?? null,
  }
}

async function getFacultyById(facultyId) {
  if (!facultyId) return null

  const response = await api.get('/facultad')
  const faculties = Array.isArray(response.data?.data) ? response.data.data : []
  return faculties.find(item => String(item.id) === String(facultyId)) ?? null
}

async function getDepartmentById(facultyId, departmentId) {
  if (!facultyId || !departmentId) return null

  const response = await api.get(`/facultad/${facultyId}/departamentos`)
  const departments = Array.isArray(response.data) ? response.data : response.data?.data ?? []
  return departments.find(item => String(item.id) === String(departmentId)) ?? null
}
