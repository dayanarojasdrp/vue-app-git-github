export function getUser() {
  const stored = localStorage.getItem('user')
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export function clearSession() {
  localStorage.removeItem('user')
  localStorage.removeItem('loginTime')
}

export function sanitizeSessionUser(user = {}) {
  return {
    username: user.username ?? user.usuario ?? null,
    role: user.role ?? user.rol ?? null,
    facultyId: user.facultyId ?? user.facultad_id ?? user.id_facultad ?? null,
    departmentId: user.departmentId ?? user.departamento_id ?? user.id_departamento ?? null,
  }
}

export function saveSession(user) {
  localStorage.setItem('user', JSON.stringify(sanitizeSessionUser(user)))
  localStorage.setItem('loginTime', Date.now())
}
