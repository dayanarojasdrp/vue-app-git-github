import axios from 'axios'

const usersApi = axios.create({
  baseURL: import.meta.env.VITE_USERS_API_URL || import.meta.env.VITE_USER_API_URL || 'http://127.0.0.1:8001/api',
  headers: {
    Accept: 'application/json',
  },
})

export function normalizeUser(user) {
  const username = user?.username ?? user?.usuario ?? user?.name ?? ''
  const name = user?.nombre ?? user?.name ?? username
  const role = user?.role ?? user?.rol ?? 'invitado'

  return {
    ...user,
    username,
    name,
    role,
  }
}

export async function getUsers() {
  const response = await usersApi.get('/users')
  const users = Array.isArray(response.data) ? response.data : response.data?.users ?? []

  return users
    .map(normalizeUser)
    .filter(user => user.username)
}

export async function findUserByUsername(username) {
  const users = await getUsers()
  return users.find(user => user.username === username)
}

export async function validateUser(username, password) {
  try {
    const response = await usersApi.post('/users/validate', {
      username,
      password,
    })

    return {
      valid: response.data?.valid === true,
      user: response.data?.user ? normalizeUser(response.data.user) : null,
      message: response.data?.message ?? '',
    }
  } catch (error) {
    if (error.response?.status === 401) {
      return {
        valid: false,
        user: null,
        message: error.response.data?.message ?? 'Usuario o contraseña incorrectos',
      }
    }

    throw error
  }
}

export default usersApi
