<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center">
    <div
      class="absolute inset-0 bg-black/30 backdrop-blur-md"
      @click="$emit('close')"
    ></div>

    <div
      class="relative bg-white w-[520px] rounded-2xl shadow-2xl p-5 animate-fade"
      @click.stop
    >
      <div class="flex justify-between items-center mb-5">
        <div>
          <h2 class="text-lg font-semibold text-slate-800">Configuración</h2>
          <p class="text-xs text-slate-500">{{ currentFaculty?.facultyName || 'Facultad actual' }}</p>
        </div>

        <button
          @click="$emit('close')"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-500 transition"
        >
          X
        </button>
      </div>

      <div class="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
        <button @click="tab = 'usuarios'" :class="tabClass('usuarios')">Usuarios</button>
        <button @click="tab = 'actividad'" :class="tabClass('actividad')">Actividad</button>
        <button @click="tab = 'roles'" :class="tabClass('roles')">Roles</button>
      </div>

      <div v-if="tab === 'usuarios'" class="space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-700">Usuarios con acceso</p>
            <p class="text-xs text-slate-500">Solo roles de tu facultad.</p>
          </div>

          <button
            @click="reloadAll"
            class="px-3 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-60"
            :disabled="loading"
          >
            {{ loading ? 'Cargando...' : 'Recargar' }}
          </button>
        </div>

        <div class="max-h-72 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
          <div
            v-for="u in accessUsers"
            :key="`${u.role}-${u.username}-${u.departmentId || u.facultyId}`"
            class="px-3 py-2 bg-white"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-medium text-slate-700">{{ u.username }}</p>
                <p class="text-xs text-slate-500">{{ displayName(u.username) }}</p>
              </div>
              <span class="text-[11px] px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                {{ u.roleLabel }}
              </span>
            </div>
            <p v-if="u.departmentName" class="text-xs text-slate-400 mt-1">{{ u.departmentName }}</p>
          </div>

          <p v-if="!loading && accessUsers.length === 0" class="text-sm text-slate-500 px-3 py-4 text-center">
            No hay usuarios con acceso en esta facultad.
          </p>
        </div>
      </div>

      <div v-if="tab === 'actividad'" class="space-y-4">
        <div>
          <p class="text-sm font-semibold text-slate-700">Actividad de la facultad</p>
          <p class="text-xs text-slate-500">Incluye acciones de documentos, PPA y alumnos ayudantes.</p>
        </div>

        <div class="max-h-80 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
          <div
            v-for="log in recentActivity"
            :key="`${log.accion}-${log.created_at}-${log.descripcion}`"
            class="px-3 py-2 bg-white"
          >
            <p class="text-sm font-medium text-slate-700">{{ log.accion }}</p>
            <p class="text-xs text-slate-500">{{ log.descripcion }}</p>
            <p class="text-[11px] text-slate-400 mt-1">{{ formatDate(log.created_at) }}</p>
          </div>

          <p v-if="!loading && recentActivity.length === 0" class="text-sm text-slate-500 px-3 py-4 text-center">
            No hay actividad reciente.
          </p>
        </div>
      </div>

      <div v-if="tab === 'roles'" class="space-y-4">
        <div>
          <p class="text-sm font-semibold text-slate-700">Dar acceso por rol</p>
          <p class="text-xs text-slate-500">Decano y jefes de departamento de tu facultad.</p>
        </div>

        <div class="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            class="py-2 text-sm rounded-lg transition"
            :class="roleTab === 'decano' ? 'bg-white shadow text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-700'"
            @click="roleTab = 'decano'"
          >
            Decano
          </button>
          <button
            type="button"
            class="py-2 text-sm rounded-lg transition"
            :class="roleTab === 'jefe' ? 'bg-white shadow text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-700'"
            @click="roleTab = 'jefe'"
          >
            Jefe de departamento
          </button>
        </div>

        <p
          v-if="message"
          class="text-sm rounded-xl px-3 py-2 border"
          :class="messageType === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'"
        >
          {{ message }}
        </p>

        <div v-if="roleTab === 'decano'" class="space-y-3">
          <input
            v-model="deanUsername"
            class="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="Usuario del decano"
          />

          <button
            @click="saveDean"
            :disabled="saving"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {{ saving ? 'Guardando...' : 'Dar acceso como decano' }}
          </button>
        </div>

        <div v-else class="space-y-3">
          <input
            v-model="departmentHeadUsername"
            class="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="Usuario del jefe de departamento"
          />

          <select
            v-model="selectedDepartmentId"
            class="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition"
          >
            <option disabled value="">Selecciona departamento</option>
            <option
              v-for="department in departments"
              :key="department.id"
              :value="String(department.id)"
            >
              {{ department.nombre }}
            </option>
          </select>

          <button
            @click="saveDepartmentHead"
            :disabled="saving"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {{ saving ? 'Guardando...' : 'Dar acceso como jefe' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="confirmDialog.show" class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div class="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-5 animate-fade">
        <h3 class="text-base font-semibold text-slate-800 mb-2">{{ confirmDialog.title }}</h3>
        <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{{ confirmDialog.message }}</p>

        <div class="flex justify-end gap-2 mt-5">
          <button
            class="px-4 py-2 rounded-xl text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            @click="resolveConfirm(false)"
          >
            Cancelar
          </button>
          <button
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
import { computed, onMounted, ref } from 'vue'
import api from '../api/axios'
import { getUsers } from '../api/users'
import {
  assignDean,
  assignDepartmentHead,
  findDeanByFaculty,
  findDepartmentHeadByDepartment,
  getAccessUsersByFaculty,
  getCurrentUserFaculty
} from '../utiles/vicedecanos'

defineEmits(['close'])

const tab = ref('usuarios')
const roleTab = ref('decano')
const allUsers = ref([])
const accessUsers = ref([])
const logs = ref([])
const departments = ref([])
const loading = ref(false)
const saving = ref(false)
const message = ref('')
const messageType = ref('')
const deanUsername = ref('')
const departmentHeadUsername = ref('')
const selectedDepartmentId = ref('')
const currentFaculty = ref(getCurrentUserFaculty())
const confirmDialog = ref({
  show: false,
  title: '',
  message: '',
  resolver: null
})

const recentActivity = computed(() => {
  return logs.value.filter(log => {
    const hasFacultyField = (
      Object.prototype.hasOwnProperty.call(log, 'facultad_id') ||
      Object.prototype.hasOwnProperty.call(log, 'id_facultad') ||
      Object.prototype.hasOwnProperty.call(log, 'facultyId')
    )
    const logFacultyId = log.facultad_id ?? log.id_facultad ?? log.facultyId
    return !hasFacultyField || String(logFacultyId) === String(currentFaculty.value?.facultyId)
  })
})

onMounted(reloadAll)

async function reloadAll() {
  loading.value = true
  message.value = ''

  try {
    await Promise.all([
      loadUsers(),
      loadAccessUsers(),
      loadDepartments(),
      loadLogs()
    ])
  } finally {
    loading.value = false
  }
}

async function loadUsers() {
  allUsers.value = await getUsers()
}

function loadAccessUsers() {
  accessUsers.value = currentFaculty.value?.facultyId
    ? getAccessUsersByFaculty(currentFaculty.value.facultyId)
    : []
}

async function loadDepartments() {
  if (!currentFaculty.value?.facultyId) {
    departments.value = []
    return
  }

  const response = await api.get(`/facultad/${currentFaculty.value.facultyId}/departamentos`)
  departments.value = Array.isArray(response.data) ? response.data : response.data?.data ?? []
}

async function loadLogs() {
  const response = await api.get('/logs')
  logs.value = Array.isArray(response.data) ? response.data : response.data?.data ?? []
}

function tabClass(t) {
  return [
    'flex-1 py-1.5 text-sm rounded-lg transition',
    tab.value === t
      ? 'bg-white shadow text-blue-600 font-medium'
      : 'text-slate-500 hover:text-slate-700'
  ]
}

function displayName(username) {
  const user = allUsers.value.find(item => item.username === username)
  return user?.name && user.name !== username ? user.name : username
}

function currentFacultyForAssignment() {
  return {
    id: currentFaculty.value?.facultyId,
    nombre: currentFaculty.value?.facultyName,
    abreviatura: currentFaculty.value?.facultyAbbreviation,
  }
}

function userExists(username) {
  return allUsers.value.some(user => user.username === username)
}

async function saveDean() {
  const username = deanUsername.value.trim()
  if (!username) return setMessage('Escribe el usuario del decano', 'error')
  if (!userExists(username)) return setMessage('Ese usuario no existe en la API', 'error')

  saving.value = true
  message.value = ''

  try {
    const faculty = currentFacultyForAssignment()
    const currentDean = findDeanByFaculty(faculty.id)

    if (currentDean && currentDean.username !== username) {
      const confirmed = await showConfirm({
        title: 'Cambiar decano',
        message: `Ya existe ${currentDean.username} como decano de ${faculty.nombre}.\n\n¿Seguro que quieres darle acceso como decano a ${username}? El usuario anterior dejará de tener acceso con ese rol.`
      })

      if (!confirmed) return
    }

    assignDean({ username, faculty })
    loadAccessUsers()
    deanUsername.value = ''
    setMessage('Acceso de decano actualizado correctamente', 'success')
  } finally {
    saving.value = false
  }
}

async function saveDepartmentHead() {
  const username = departmentHeadUsername.value.trim()
  const department = departments.value.find(item => String(item.id) === String(selectedDepartmentId.value))

  if (!username || !department) return setMessage('Escribe el usuario y selecciona el departamento', 'error')
  if (!userExists(username)) return setMessage('Ese usuario no existe en la API', 'error')

  saving.value = true
  message.value = ''

  try {
    const faculty = currentFacultyForAssignment()
    const currentHead = findDepartmentHeadByDepartment(department.id)

    if (currentHead && currentHead.username !== username) {
      const confirmed = await showConfirm({
        title: 'Cambiar jefe de departamento',
        message: `Ya existe ${currentHead.username} como jefe de ${department.nombre}.\n\n¿Seguro que quieres darle acceso como jefe a ${username}? El usuario anterior dejará de tener acceso con ese rol.`
      })

      if (!confirmed) return
    }

    assignDepartmentHead({ username, department, faculty })
    loadAccessUsers()
    departmentHeadUsername.value = ''
    selectedDepartmentId.value = ''
    setMessage('Acceso de jefe de departamento actualizado correctamente', 'success')
  } finally {
    saving.value = false
  }
}

function setMessage(text, type) {
  message.value = text
  messageType.value = type
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

function formatDate(value) {
  return new Date(value).toLocaleString()
}
</script>
