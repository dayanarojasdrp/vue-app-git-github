<template>
  <div class="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200">
  <button
    type="button"
    class="absolute right-6 top-6 z-10 h-11 w-11 rounded-full bg-white/70 border border-white/60 shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-white transition"
    title="Configuración"
    @click="openAdminAuth"
  >
    <Cog6ToothIcon class="h-6 w-6" />
  </button>

  <div class="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-10"></div>
 <div class="absolute w-72 h-72 bg-purple-300/20 rounded-full blur-3xl bottom-10 right-10"></div>
    <!-- Card -->
    <div class="w-[320px] p-6 rounded-3xl backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl">

      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-slate-800 mb-2">
        Bienvenido
      </h2>
      <p class="text-sm text-slate-400 text-center mb-6">
        Inicia sesión para continuar
      </p>
<div 
  v-if="message"
  class="mb-4 px-4 py-3 rounded-xl text-sm font-medium border animate-fade"
  :class="{
    'bg-red-100 text-red-700 border-red-200': messageType === 'error',
    'bg-yellow-100 text-yellow-700 border-yellow-200': messageType === 'warning'
  }"
>
  {{ message }}
</div>
      <!-- Form -->
      <form @submit.prevent="login" class="space-y-4">

        <!-- Usuario -->
        <div>
          <label class="text-sm text-slate-600">Usuario</label>
          <input
            v-model="username"
            type="text"
            class="w-full mt-1 px-4 py-2 rounded-xl bg-white/80 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none transition shadow-sm"
            placeholder="Ingresa tu usuario"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="text-sm text-slate-600">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="w-full mt-1 px-4 py-2 rounded-xl bg-white/80 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none transition shadow-sm"
            placeholder="••••••••"
          />
        </div>

        <!-- Botón -->
        <button
          :disabled="loading"
          class="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-xl font-semibold transition shadow-lg hover:scale-[1.02]"
          :class="{ 'opacity-70 cursor-not-allowed hover:scale-100': loading }"
        >
          {{ loading ? 'Verificando...' : 'Iniciar sesión' }}
        </button>

      </form>

      <!-- Footer -->
      <p class="text-xs text-center text-slate-400 mt-6">
        Sistema de Gestión de Roles
      </p>

    </div>

    <div v-if="showAdminModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-white/70 p-5">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Configuración</h3>
            <p class="text-sm text-slate-500">
              {{ adminAuthenticated ? 'Permisos del sistema' : 'Autenticación de administrador' }}
            </p>
          </div>

          <button
            type="button"
            class="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition"
            @click="closeAdminModal"
          >
            ✕
          </button>
        </div>

        <form v-if="!adminAuthenticated" class="space-y-4" @submit.prevent="authenticateAdmin">
          <p
            v-if="adminMessage"
            class="text-sm rounded-xl px-3 py-2 border"
            :class="adminMessageType === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'"
          >
            {{ adminMessage }}
          </p>

          <div>
            <label class="text-sm text-slate-600">Usuario administrador</label>
            <input
              v-model="adminUsername"
              type="text"
              class="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="usuario01"
            />
          </div>

          <div>
            <label class="text-sm text-slate-600">Contraseña</label>
            <input
              v-model="adminPassword"
              type="password"
              class="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="clave01"
            />
          </div>

          <button
            type="submit"
            :disabled="adminLoading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {{ adminLoading ? 'Validando...' : 'Entrar a configuración' }}
          </button>
        </form>

        <div v-else class="space-y-4">
          <p
            v-if="adminMessage"
            class="text-sm rounded-xl px-3 py-2 border"
            :class="adminMessageType === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'"
          >
            {{ adminMessage }}
          </p>

          <div class="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              class="py-2 text-sm rounded-lg transition"
              :class="configTab === 'vicedecano' ? 'bg-white shadow text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-700'"
              @click="configTab = 'vicedecano'"
            >
              Vicedecanos
            </button>

            <button
              type="button"
              class="py-2 text-sm rounded-lg transition"
              :class="configTab === 'admin' ? 'bg-white shadow text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-700'"
              @click="configTab = 'admin'"
            >
              Administrador
            </button>
          </div>

          <div v-if="configTab === 'vicedecano'" class="space-y-4">
            <div>
              <label class="text-sm text-slate-600">Usuario</label>
              <input
                v-model="newViceUsername"
                type="text"
                class="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition"
                placeholder="usuario02"
              />
            </div>

            <div>
              <label class="text-sm text-slate-600">Facultad</label>
              <select
                v-model="selectedFacultyId"
                class="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition"
              >
                <option disabled value="">Selecciona una facultad</option>
                <option
                  v-for="faculty in faculties"
                  :key="faculty.id"
                  :value="String(faculty.id)"
                >
                  {{ faculty.nombre }}
                </option>
              </select>
            </div>

            <button
              type="button"
              :disabled="savingViceDean"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition disabled:opacity-60"
              @click="saveViceDean"
            >
              {{ savingViceDean ? 'Guardando...' : 'Dar acceso' }}
            </button>

            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <div
                v-for="item in viceDeanAssignments"
                :key="item.facultyId"
                class="px-3 py-2 border-b last:border-b-0"
              >
                <p class="text-sm font-medium text-slate-700">{{ item.facultyName }}</p>
                <p class="text-xs text-slate-500">{{ item.username }}</p>
              </div>

              <p v-if="viceDeanAssignments.length === 0" class="text-sm text-slate-500 text-center py-4">
                No hay vicedecanos docentes asignados.
              </p>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p class="text-xs text-slate-500">Administrador actual</p>
              <p class="text-sm font-semibold text-slate-700">{{ currentAdminUsername }}</p>
            </div>

            <div>
              <label class="text-sm text-slate-600">Nuevo administrador</label>
              <input
                v-model="newAdminUsername"
                type="text"
                class="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition"
                placeholder="usuario03"
              />
            </div>

            <button
              type="button"
              :disabled="savingAdmin"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold transition disabled:opacity-60"
              @click="saveSystemAdmin"
            >
              {{ savingAdmin ? 'Guardando...' : 'Dar permiso de administrador' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="confirmDialog.show" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div class="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-white/70 p-5 animate-fade">
        <h3 class="text-base font-semibold text-slate-800 mb-2">
          {{ confirmDialog.title }}
        </h3>

        <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {{ confirmDialog.message }}
        </p>

        <div class="flex justify-end gap-2 mt-5">
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            @click="resolveConfirm(false)"
          >
            Cancelar
          </button>

          <button
            type="button"
            class="px-4 py-2 rounded-xl text-sm bg-blue-600 hover:bg-blue-700 text-white transition"
            @click="resolveConfirm(true)"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import api from '../api/axios'
import { validateUser } from '../api/users'
import {
  assignAccess,
  getUserAccess,
  hasAdminAccess,
  listFacultyAccess,
  transferAdmin,
} from '../api/access'
import { saveSession } from '../utiles/auth'
import { buildSessionFromAccess } from '../utiles/sessionAccess'

const username = ref('')
const password = ref('')
const message = ref('')
const messageType = ref('') // error | warning
const loading = ref(false)
const showAdminModal = ref(false)
const adminAuthenticated = ref(false)
const adminUsername = ref('')
const adminPassword = ref('')
const adminMessage = ref('')
const adminMessageType = ref('')
const adminLoading = ref(false)
const faculties = ref([])
const selectedFacultyId = ref('')
const newViceUsername = ref('')
const savingViceDean = ref(false)
const viceDeanAssignments = ref([])
const configTab = ref('vicedecano')
const newAdminUsername = ref('')
const savingAdmin = ref(false)
const currentAdminUsername = ref('')
const confirmDialog = ref({
  show: false,
  title: '',
  message: '',
  resolver: null
})

async function login() {
  const userName = username.value.trim()
  const userPassword = password.value

  if (!userName && !userPassword) {
    message.value = 'Debes ingresar usuario y contraseña'
    messageType.value = 'error'
    return
  }

  if (!userName || !userPassword) {
    message.value = 'Completa todos los campos'
    messageType.value = 'warning'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const result = await validateUser(userName, userPassword)

    if (!result.valid || !result.user) {
      message.value = result.message || 'Usuario o contraseña incorrectos'
      messageType.value = 'error'
      return
    }

    const session = await buildSessionFromAccess(result.user)

    if (!session) {
      message.value = 'Este usuario no tiene acceso a la página'
      messageType.value = 'error'
      return
    }

    saveSession(session)

    location.reload()
  } catch (error) {
    message.value = 'No se pudo validar el usuario'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

function openAdminAuth() {
  showAdminModal.value = true
  adminAuthenticated.value = false
  adminUsername.value = ''
  adminPassword.value = ''
  adminMessage.value = ''
  adminMessageType.value = ''
  configTab.value = 'vicedecano'
  currentAdminUsername.value = ''
}

function closeAdminModal() {
  showAdminModal.value = false
}

async function authenticateAdmin() {
  const userName = adminUsername.value.trim()
  const userPassword = adminPassword.value

  if (!userName || !userPassword) {
    adminMessage.value = 'Completa usuario y contraseña'
    adminMessageType.value = 'error'
    return
  }

  adminLoading.value = true
  adminMessage.value = ''

  try {
    const result = await validateUser(userName, userPassword)

    if (!result.valid) {
      adminMessage.value = result.message || 'Usuario o contraseña incorrectos'
      adminMessageType.value = 'error'
      return
    }

    const accessResult = await getUserAccess(userName)

    if (!hasAdminAccess(accessResult.access)) {
      adminMessage.value = 'Este usuario no tiene permiso de administrador'
      adminMessageType.value = 'error'
      return
    }

    adminAuthenticated.value = true
    adminMessage.value = ''
    currentAdminUsername.value = userName
    await loadFaculties()
    await loadViceDeanAssignments()
  } catch (error) {
    adminMessage.value = 'No se pudo validar el administrador'
    adminMessageType.value = 'error'
  } finally {
    adminLoading.value = false
  }
}

async function loadFaculties() {
  try {
    const response = await api.get('/facultad')
    faculties.value = Array.isArray(response.data?.data) ? response.data.data : []
  } catch (error) {
    faculties.value = []
    adminMessage.value = 'No se pudieron cargar las facultades'
    adminMessageType.value = 'error'
  }
}

async function loadViceDeanAssignments() {
  const accessLists = await Promise.all(
    faculties.value.map(async faculty => {
      const access = await listFacultyAccess(faculty.id)
      return access
        .filter(item => item.role === 'vicedecano_docente')
        .map(item => ({
          ...item,
          facultyId: faculty.id,
          facultyName: faculty.nombre,
          facultyAbbreviation: faculty.abreviatura,
        }))
    })
  )

  viceDeanAssignments.value = accessLists.flat()
}

async function saveViceDean() {
  const userName = newViceUsername.value.trim()
  const faculty = faculties.value.find(item => String(item.id) === String(selectedFacultyId.value))

  if (!userName || !faculty) {
    adminMessage.value = 'Escribe el usuario y selecciona una facultad'
    adminMessageType.value = 'error'
    return
  }

  savingViceDean.value = true
  adminMessage.value = ''

  try {
    const facultyAccess = await listFacultyAccess(faculty.id)
    const currentViceDean = facultyAccess.find(item => item.role === 'vicedecano_docente')

    if (currentViceDean && currentViceDean.username !== userName) {
      const confirmed = await showConfirm({
        title: 'Reemplazar vicedecano docente',
        message: `Ya existe ${currentViceDean.username} como vicedecano docente de ${faculty.nombre}.\n\n¿Seguro que quieres agregar a ${userName}? El usuario anterior dejará de tener acceso a la página.`
      })

      if (!confirmed) return
    }

    await assignAccess({
      username: userName,
      role: 'vicedecano_docente',
      facultyId: faculty.id,
      departmentId: null,
    })
    await loadViceDeanAssignments()
    newViceUsername.value = ''
    selectedFacultyId.value = ''
    adminMessage.value = 'Acceso actualizado correctamente'
    adminMessageType.value = 'success'
  } catch (error) {
    adminMessage.value = accessErrorMessage(error, 'No se pudo guardar el acceso')
    adminMessageType.value = 'error'
  } finally {
    savingViceDean.value = false
  }
}

async function saveSystemAdmin() {
  const userName = newAdminUsername.value.trim()

  if (!userName) {
    adminMessage.value = 'Escribe el usuario que será administrador'
    adminMessageType.value = 'error'
    return
  }

  if (userName === currentAdminUsername.value) {
    adminMessage.value = 'Ese usuario ya es el administrador actual'
    adminMessageType.value = 'error'
    return
  }

  savingAdmin.value = true
  adminMessage.value = ''

  try {
    const confirmed = await showConfirm({
      title: 'Cambiar administrador',
      message: `Vas a darle permiso de administrador a ${userName}.\n\nCuando aceptes, ${currentAdminUsername.value} dejará de poder entrar a esta configuración.`
    })

    if (!confirmed) return

    await transferAdmin(userName)
    currentAdminUsername.value = userName
    newAdminUsername.value = ''
    adminMessage.value = `${userName} ahora es el administrador del sistema`
    adminMessageType.value = 'success'

    setTimeout(() => {
      closeAdminModal()
    }, 900)
  } catch (error) {
    adminMessage.value = accessErrorMessage(error, 'No se pudo guardar el administrador')
    adminMessageType.value = 'error'
  } finally {
    savingAdmin.value = false
  }
}

function accessErrorMessage(error, fallback) {
  if (error?.response?.status === 422) {
    return error.response.data?.message || 'Ese usuario no existe en la API'
  }

  return error?.response?.data?.message || fallback
}

function showConfirm({ title, message }) {
  confirmDialog.value = {
    show: true,
    title,
    message,
    resolver: null
  }

  return new Promise(resolve => {
    confirmDialog.value.resolver = resolve
  })
}

function resolveConfirm(value) {
  confirmDialog.value.show = false
  confirmDialog.value.resolver?.(value)
  confirmDialog.value.resolver = null
}
</script>
<style scoped>
@keyframes fade {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade {
  animation: fade 0.25s ease;
}
</style>
