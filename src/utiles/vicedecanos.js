import { getUser } from './auth'

export function canAccessApp(username) {
  const user = getUser()
  return Boolean(
    user?.username === username &&
    ['vicedecano_docente', 'decano', 'jefe_departamento'].includes(user?.role)
  )
}

export function getCurrentUserFaculty() {
  const user = getUser()
  if (!user?.facultyId) return null

  return {
    facultyId: user.facultyId,
    facultyName: user.facultyName,
    facultyAbbreviation: user.facultyAbbreviation,
  }
}

export function getCurrentUserFacultyId() {
  return getCurrentUserFaculty()?.facultyId ?? null
}

export function getCurrentUserAccess() {
  const user = getUser()
  if (!user) return null

  return {
    username: user.username,
    role: user.role,
    roleLabel: user.roleLabel,
    facultyId: user.facultyId,
    facultyName: user.facultyName,
    facultyAbbreviation: user.facultyAbbreviation,
    departmentId: user.departmentId,
    departmentName: user.departmentName,
    allAccess: user.access ?? [],
  }
}

export function isCurrentUserDepartmentHead() {
  return getCurrentUserAccess()?.role === 'jefe_departamento'
}
