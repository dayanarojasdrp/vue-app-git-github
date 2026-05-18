const DEFAULT_ADMIN_USERNAME = 'usuario01'
const ADMIN_STORAGE_KEY = 'systemAdminUsername'
const STORAGE_KEY = 'vicedecanosDocentes'
const DEANS_STORAGE_KEY = 'decanos'
const DEPARTMENT_HEADS_STORAGE_KEY = 'jefesDepartamento'

export function getSystemAdminUsername() {
  return localStorage.getItem(ADMIN_STORAGE_KEY) || DEFAULT_ADMIN_USERNAME
}

export function isSystemAdmin(username) {
  return username === getSystemAdminUsername()
}

export function assignSystemAdmin(username) {
  localStorage.setItem(ADMIN_STORAGE_KEY, username)
  return username
}

export function getViceDeanAssignments() {
  return getStoredAssignments(STORAGE_KEY)
}

function getStoredAssignments(key) {
  const stored = localStorage.getItem(key)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem(key)
    return []
  }
}

function saveStoredAssignments(key, assignments) {
  localStorage.setItem(key, JSON.stringify(assignments))
}

export function getDeanAssignments() {
  return getStoredAssignments(DEANS_STORAGE_KEY)
}

export function getDepartmentHeadAssignments() {
  return getStoredAssignments(DEPARTMENT_HEADS_STORAGE_KEY)
}

export function findViceDeanByFaculty(facultyId) {
  return getViceDeanAssignments().find(item => String(item.facultyId) === String(facultyId))
}

export function findViceDeanByUsername(username) {
  return getViceDeanAssignments().find(item => item.username === username)
}

export function canAccessApp(username) {
  return Boolean(getUserAccess(username))
}

export function getUserFaculty(username) {
  const access = getUserAccess(username)
  if (!access) return null

  return {
    facultyId: access.facultyId,
    facultyName: access.facultyName,
    facultyAbbreviation: access.facultyAbbreviation,
  }
}

export function getUserAccess(username) {
  const viceDean = findViceDeanByUsername(username)
  if (viceDean) return { ...viceDean, role: 'vicedecano_docente', roleLabel: 'Vicedecano docente' }

  const dean = getDeanAssignments().find(item => item.username === username)
  if (dean) return { ...dean, role: 'decano', roleLabel: 'Decano' }

  const departmentHead = getDepartmentHeadAssignments().find(item => item.username === username)
  if (departmentHead) return { ...departmentHead, role: 'jefe_departamento', roleLabel: 'Jefe de departamento' }

  return null
}

export function getCurrentUserFaculty() {
  const stored = localStorage.getItem('user')
  if (!stored) return null

  try {
    const user = JSON.parse(stored)

    if (user?.facultyId) {
      return {
        facultyId: user.facultyId,
        facultyName: user.facultyName,
        facultyAbbreviation: user.facultyAbbreviation,
      }
    }

    return getUserFaculty(user?.username)
  } catch {
    return null
  }
}

export function getCurrentUserFacultyId() {
  return getCurrentUserFaculty()?.facultyId ?? null
}

export function assignViceDean({ username, faculty }) {
  const assignments = getViceDeanAssignments()
  const nextAssignments = assignments.filter(item => String(item.facultyId) !== String(faculty.id))

  const assignment = {
    username,
    facultyId: faculty.id,
    facultyName: faculty.nombre,
    facultyAbbreviation: faculty.abreviatura,
  }

  nextAssignments.push(assignment)
  saveStoredAssignments(STORAGE_KEY, nextAssignments)

  return assignment
}

export function findDeanByFaculty(facultyId) {
  return getDeanAssignments().find(item => String(item.facultyId) === String(facultyId))
}

export function assignDean({ username, faculty }) {
  const assignments = getDeanAssignments()
  const nextAssignments = assignments.filter(item => String(item.facultyId) !== String(faculty.id))

  const assignment = {
    username,
    facultyId: faculty.id,
    facultyName: faculty.nombre,
    facultyAbbreviation: faculty.abreviatura,
  }

  nextAssignments.push(assignment)
  saveStoredAssignments(DEANS_STORAGE_KEY, nextAssignments)

  return assignment
}

export function findDepartmentHeadByDepartment(departmentId) {
  return getDepartmentHeadAssignments().find(item => String(item.departmentId) === String(departmentId))
}

export function assignDepartmentHead({ username, department, faculty }) {
  const assignments = getDepartmentHeadAssignments()
  const nextAssignments = assignments.filter(item => String(item.departmentId) !== String(department.id))

  const assignment = {
    username,
    departmentId: department.id,
    departmentName: department.nombre,
    facultyId: faculty.id,
    facultyName: faculty.nombre,
    facultyAbbreviation: faculty.abreviatura,
  }

  nextAssignments.push(assignment)
  saveStoredAssignments(DEPARTMENT_HEADS_STORAGE_KEY, nextAssignments)

  return assignment
}

export function getAccessUsersByFaculty(facultyId) {
  const users = []

  getViceDeanAssignments()
    .filter(item => String(item.facultyId) === String(facultyId))
    .forEach(item => users.push({ ...item, role: 'vicedecano_docente', roleLabel: 'Vicedecano docente' }))

  getDeanAssignments()
    .filter(item => String(item.facultyId) === String(facultyId))
    .forEach(item => users.push({ ...item, role: 'decano', roleLabel: 'Decano' }))

  getDepartmentHeadAssignments()
    .filter(item => String(item.facultyId) === String(facultyId))
    .forEach(item => users.push({ ...item, role: 'jefe_departamento', roleLabel: 'Jefe de departamento' }))

  return users
}
