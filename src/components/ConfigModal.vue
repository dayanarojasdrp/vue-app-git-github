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
     <div class="flex justify-between items-center mb-5">
  <h2 class="text-lg font-semibold text-slate-800">
    Configuración del sistema
  </h2>

  <button
    @click="$emit('close')"
    class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-500 transition"
  >
    ✕
  </button>
</div>

      <!-- Tabs -->
     <div class="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
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

       <div class="space-y-3">

  <!-- SELECT ACCIÓN -->
  <div>
    <label class="text-xs text-slate-500 mb-1 block">
      Acción
    </label>

    <select v-model="userTab"
      class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50
             focus:ring-2 focus:ring-blue-500 transition"
    >
      <option value="crear">Dar acceso</option>
      <option value="editar">Modificar usuario</option>
      <option value="eliminar">Eliminar usuario</option>
    </select>
  </div>

</div>

        <!-- CREAR -->
        <div v-if="userTab === 'crear'" class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">

  <input
    v-model="newUser"
    placeholder="Nombre de usuario"
    class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white
           focus:ring-2 focus:ring-blue-500 transition"
  />

  <select
    v-model="newRole"
    class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white
           focus:ring-2 focus:ring-blue-500 transition"
  >
    <option disabled value="">Selecciona rol</option>
    <option>admin</option>
    <option>jefe de departamento</option>
    <option>invitado</option>
  </select>

  <button
    @click="addUser"
    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
  >
    Guardar usuario
  </button>

</div>

        <!-- EDITAR -->
       <div v-if="userTab === 'editar'" class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">

  <!-- 🔵 SELECT USUARIO -->
  <div>
    <label class="text-xs text-slate-500 mb-1 block">
      Usuario
    </label>

    <select
      v-model="selectedUser"
      class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white
             focus:ring-2 focus:ring-blue-500 transition"
    >
      <option disabled value="">Selecciona usuario</option>
      <option v-for="u in usuarios" :key="u.username" :value="u">
        {{ u.username }}
      </option>
    </select>
  </div>

  <!-- 🔥 CARD USUARIO -->
  <div v-if="selectedUser" class="bg-white border rounded-xl p-3 shadow-sm">
    <p class="text-sm font-medium text-slate-700">
      {{ selectedUser.username }}
    </p>

    <p class="text-xs text-slate-500">
      Rol actual: {{ selectedUser.role }}
    </p>
  </div>

  <!-- 🔵 NUEVO ROL -->
  <div>
    <label class="text-xs text-slate-500 mb-1 block">
      Nuevo rol
    </label>

    <select
      v-model="newRole"
      class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white
             focus:ring-2 focus:ring-blue-500 transition"
    >
      <option disabled value="">Selecciona nuevo rol</option>
      <option>admin</option>
      <option>jefe de departamento</option>
      <option>invitado</option>
    </select>
  </div>

  <!-- 🔵 BOTÓN -->
  <button
    @click="updateUser"
    class="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl font-medium transition disabled:opacity-50"
    :disabled="!selectedUser || !newRole"
  >
    Guardar cambios
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

         <button
  @click="deleteUser(selectedUser)"
  class="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium transition"
>
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
    'flex-1 py-1.5 text-sm rounded-lg transition',
    tab.value === t
      ? 'bg-white shadow text-blue-600 font-medium'
      : 'text-slate-500 hover:text-slate-700'
  ]
}


function subTab(active, t) {
  return [
    'px-3 py-1 text-xs rounded-lg transition font-medium',
    active === t
      ? 'bg-blue-500 text-white'
      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
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
