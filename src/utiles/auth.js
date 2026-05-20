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

export function saveSession(user) {
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('loginTime', Date.now())
}
