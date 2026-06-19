import { getUser } from './auth'

const ROLE_LABELS = {
  admin: 'Administrador',
  vicedecano_docente: 'Vicedecano docente',
  decano: 'Decano',
  jefe_departamento: 'Jefe de departamento',
}

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
    facultyName: user.facultyName ?? null,
    facultyAbbreviation: user.facultyAbbreviation ?? null,
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
    roleLabel: user.roleLabel ?? ROLE_LABELS[user.role] ?? user.role,
    facultyId: user.facultyId,
    facultyName: user.facultyName ?? null,
    facultyAbbreviation: user.facultyAbbreviation ?? null,
    departmentId: user.departmentId,
    departmentName: user.departmentName ?? null,
    allAccess: user.access ?? [],
  }
}

export function isCurrentUserDepartmentHead() {
  return getCurrentUserAccess()?.role === 'jefe_departamento'
}
