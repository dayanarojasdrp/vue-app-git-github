<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center">

    <!-- 🔥 FONDO GLOBAL (desenfoca TODO, incluso header) -->
    <div 
      class="absolute inset-0 bg-black/30 backdrop-blur-md"
      @click="$emit('close')"
    ></div>

    <!-- 🔵 TU MODAL ORIGINAL -->
    <div 
      class="relative bg-white w-[420px] rounded-2xl shadow-2xl p-5 animate-fade"
      @click.stop
    >

      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">Configuración del sistema</h2>

        <button @click="$emit('close')" class="text-slate-400 hover:text-red-500">
          ✕
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">

        <button @click="tab = 'usuarios'" :class="tabClass('usuarios')">
          Usuarios
        </button>

        <button @click="tab = 'actividad'" :class="tabClass('actividad')">
          Actividad
        </button>

        <button @click="tab = 'roles'" :class="tabClass('roles')">
          Roles
        </button>

      </div>

      <!-- 👤 USUARIOS -->
      <div v-if="tab === 'usuarios'" class="space-y-4">

        <div class="flex gap-2 mb-2">
          <button @click="userTab = 'crear'" :class="subTab(userTab, 'crear')">
            Dar acceso
          </button>

          <button @click="userTab = 'editar'" :class="subTab(userTab, 'editar')">
            Modificar
          </button>

          <button @click="userTab = 'eliminar'" :class="subTab(userTab, 'eliminar')">
            Eliminar
          </button>
        </div>

        <!-- CREAR -->
        <div v-if="userTab === 'crear'" class="space-y-3">
          <input v-model="newUser" placeholder="Nombre usuario"
            class="w-full px-3 py-2 border rounded-xl" />

          <select v-model="newRole" class="w-full px-3 py-2 border rounded-xl">
            <option disabled value="">Rol</option>
            <option>admin</option>
            <option>jefe de departamento</option>
            <option>invitado</option>
          </select>

          <button @click="addUser"
            class="w-full bg-blue-500 text-white py-2 rounded-xl">
            Dar acceso
          </button>
        </div>

        <!-- EDITAR -->
        <div v-if="userTab === 'editar'" class="space-y-3">
          <select v-model="selectedUser" class="w-full px-3 py-2 border rounded-xl">
            <option disabled value="">Selecciona usuario</option>
            <option v-for="u in usuarios" :key="u.username" :value="u">
              {{ u.username }}
            </option>
          </select>

          <select v-model="newRole" class="w-full px-3 py-2 border rounded-xl">
            <option disabled value="">Nuevo rol</option>
            <option>admin</option>
            <option>jefe de departamento</option>
            <option>invitado</option>
          </select>

          <button @click="updateUser"
            class="w-full bg-yellow-500 text-white py-2 rounded-xl">
            Actualizar
          </button>
        </div>

        <!-- ELIMINAR -->
        <div v-if="userTab === 'eliminar'" class="space-y-3">
          <select v-model="selectedUser" class="w-full px-3 py-2 border rounded-xl">
            <option disabled value="">Selecciona usuario</option>
            <option v-for="u in usuarios" :key="u.username" :value="u">
              {{ u.username }}
            </option>
          </select>

          <button @click="deleteUser(selectedUser)"
            class="w-full bg-red-500 text-white py-2 rounded-xl">
            Eliminar usuario
          </button>
        </div>

      </div>

      <!-- ACTIVIDAD -->
      <div v-if="tab === 'actividad'">
        <p class="text-sm text-slate-500">
          Aquí verás acciones realizadas por usuarios
        </p>
      </div>

      <!-- ROLES -->
      <div v-if="tab === 'roles'">
        <p class="text-sm text-slate-500">
          Gestión de permisos
        </p>
      </div>

    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

defineEmits(['close'])

const tab = ref('usuarios')
const userTab = ref('crear')

const newUser = ref('')
const newRole = ref('')
const selectedUser = ref(null)

const usuarios = ref(JSON.parse(localStorage.getItem('usuarios')) || [])
function tabClass(t) {
  return [
    'px-3 py-1 rounded-lg text-sm transition',
    tab.value === t
      ? 'bg-blue-500 text-white'
      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
  ]
}

function subTab(active, t) {
  return [
    'px-3 py-1 text-xs rounded-lg transition',
    active === t
      ? 'bg-blue-500 text-white'
      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
  ]
}

function addUser() {
  if (!newUser.value || !newRole.value) return

  usuarios.value.push({
    username: newUser.value,
    password: '123',
    name: newUser.value,
    role: newRole.value
  })

  localStorage.setItem('usuarios', JSON.stringify(usuarios.value))

  newUser.value = ''
  newRole.value = ''
}

function updateUser() {
  if (!selectedUser.value || !newRole.value) return

  selectedUser.value.role = newRole.value

  localStorage.setItem('usuarios', JSON.stringify(usuarios.value))

  newRole.value = ''
}

function deleteUser(u) {
  if (!u) return

  usuarios.value = usuarios.value.filter(x => x.username !== u.username)

  localStorage.setItem('usuarios', JSON.stringify(usuarios.value))
}
</script>
