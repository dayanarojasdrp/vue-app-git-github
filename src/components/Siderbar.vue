<template>
 <aside class="w-56 h-screen bg-blue-50 border-r flex flex-col">
    
    <div class="px-4 py-4 border-b flex items-center gap-3">

  <!-- Icono -->
  <svg xmlns="http://www.w3.org/2000/svg" 
       class="w-6 h-6 text-slate-700"
       fill="none" 
       viewBox="0 0 24 24" 
       stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M3 7h18M3 12h18M3 17h18" />
  </svg>

  <!-- Texto en 2 líneas -->
  <div class="leading-tight">
    <p class="text-sm font-semibold text-slate-800">
      Gestión
    </p>
    <p class="text-sm font-semibold text-slate-800">
      de Roles
    </p>
  </div>

</div>

    <nav class="flex-1 px-3 py-4 space-y-1">
      
     <button class="link" :class="{ active: active === 'panel' }" @click="$emit('change', 'panel')">
  <Squares2X2Icon class="w-5 h-5 mr-3" />
  Panel
</button>

      <button class="link" :class="{ active: active === 'profesores' }" @click="$emit('change', 'profesores')">
  <UserGroupIcon class="w-5 h-5 mr-3" />
  Profesores
</button>

      <button class="link" :class="{ active: active === 'estudiantes' }" @click="$emit('change', 'estudiantes')">
  <AcademicCapIcon class="w-5 h-5 mr-3" />
  Estudiantes
</button>

      <button class="link" :class="{ active: active === 'documentos' }" @click="$emit('change', 'documentos')">
  <DocumentTextIcon class="w-5 h-5 mr-3" />
  Documentos
</button>

    </nav>
<div class="px-3 pb-2">
 <button
  class="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition text-sm"
  @click="showConfig = true"
>
  <Cog6ToothIcon class="w-5 h-5" />
  Configuración
</button>
</div>
    <!-- 👇 USUARIO (AHORA SÍ DENTRO) -->
   <div ref="menuRef" class="mt-auto px-3 py-3 border-t relative">

  <!-- Usuario -->
  <div 
  @click="toggleMenu" 
  :class="[
    'flex items-center gap-2 cursor-pointer px-3 py-2 rounded-2xl transition-all duration-200',
    showMenu 
      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
      : 'hover:bg-slate-100 hover:translate-x-1'
  ]"
>
    
    <!-- Avatar -->
    <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
      {{ userInitial }}
    </div>

    <!-- Info -->
    <div class="flex-1">
      <p :class="showMenu ? 'text-white text-sm font-semibold' : 'text-slate-800 text-sm font-semibold'">
        {{ user?.name }}
      </p>
      <p :class="showMenu ? 'text-blue-100 text-xs' : 'text-slate-400 text-xs'">
        {{ user?.role }}
      </p>
    </div>

    <!-- Flechita -->
    <span class="text-slate-400 text-xs"></span>
  </div>

  <!-- Dropdown elegante -->
  <div 
    v-if="showMenu" 
     class="absolute bottom-14 left-2 w-52 bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl p-4 text-sm animate-fade"
  >
    
    <div class="mb-3">
  <p class="font-semibold text-slate-800">{{ user?.name }}</p>
  <p class="text-xs text-blue-500 font-medium">{{ user?.role }}</p>
</div>

    <div class="border-t pt-3 space-y-2">
      <button class="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-blue-50 transition text-slate-700">
  <UserCircleIcon class="w-4 h-4" />
  Perfil
</button>

<button 
  class="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
  @click="logout"
>
  <ArrowRightOnRectangleIcon class="w-4 h-4" />
  Cerrar sesión
</button>
    </div>

  </div>
</div>
<div v-if="showConfig" class="fixed inset-0 z-50 flex items-center justify-center">

  <!-- Fondo oscuro -->
  <div 
    class="absolute inset-0 bg-black/40 backdrop-blur-sm"
    @click="showConfig = false"
  ></div>

  <!-- Modal -->
  <div 
  class="relative bg-white w-[420px] rounded-2xl shadow-2xl p-5 animate-fade"
  @click.stop
>

    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold">Configuración del sistema</h2>

      <button @click="showConfig = false" class="text-slate-400 hover:text-red-500">
        ✕
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">

      <button 
        @click="tab = 'usuarios'"
        :class="tabClass('usuarios')"
      >
        Usuarios
      </button>

      <button 
        @click="tab = 'actividad'"
        :class="tabClass('actividad')"
      >
        Actividad
      </button>

      <button 
        @click="tab = 'roles'"
        :class="tabClass('roles')"
      >
        Roles
      </button>

    </div>

    <!-- CONTENIDO -->

    <!-- 👤 USUARIOS -->
    <div v-if="tab === 'usuarios'" class="space-y-4">

  <!-- SUB OPCIONES -->
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

  <!-- 🟢 CREAR -->
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

  <!-- 🟡 EDITAR -->
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

  <!-- 🔴 ELIMINAR -->
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

    <!-- 📊 ACTIVIDAD -->
    <div v-if="tab === 'actividad'">
      <p class="text-sm text-slate-500">
        Aquí verás acciones realizadas por usuarios (luego lo conectas backend)
      </p>
    </div>

    <!-- ⚙️ ROLES -->
    <div v-if="tab === 'roles'">
      <p class="text-sm text-slate-500">
        Gestión de permisos (puedes expandir luego)
      </p>
    </div>

  </div>
</div>
  </aside>
</template>

<style scoped>

.link {
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 12px;

  font-size: 14px;
  font-weight: 500;
  color: #334155;

  display: flex;
  align-items: center;

  transition: all 0.2s ease;
}


.link:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}


.active {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
}


.active:hover {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
}
@keyframes fade {
  from {
    opacity: 1;
    transform: translateY(10px);
  }
  to {
    opacity: 0;
    transform: translateY(0);
  }
}


.hover-move:hover {
  transform: translateX(4px);
}
</style>
<script setup>
  defineProps({
  active: String
})
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
const menuRef = ref(null)
const user = ref(null)
const showMenu = ref(false)
const showConfig = ref(false)
const tab = ref('usuarios')

const newUser = ref('')
const newRole = ref('')

const usuarios = ref(JSON.parse(localStorage.getItem('usuarios')) || [])
const userTab = ref('crear') // crear | editar | eliminar
const selectedUser = ref(null)
onMounted(() => {
  const stored = localStorage.getItem('user')
  if (stored) {
    user.value = JSON.parse(stored)
  }
})
function handleClickOutside(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
const userInitial = computed(() => {
  return user.value?.name
    ? user.value.name.charAt(0).toUpperCase()
    : '?'
})

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('loginTime')
  location.reload()
}
import {
  Squares2X2Icon,
  UserGroupIcon,
  AcademicCapIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
function tabClass(t) {
  return [
    'px-3 py-1 rounded-lg text-sm transition',
    tab.value === t
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

function deleteUser(u) {
  usuarios.value = usuarios.value.filter(x => x.username !== u.username)
  localStorage.setItem('usuarios', JSON.stringify(usuarios.value))
}

function editUser(u) {
  newUser.value = u.username
  newRole.value = u.role
}
function subTab(active, t) {
  return [
    'px-3 py-1 text-xs rounded-lg transition',
    active === t
      ? 'bg-blue-500 text-white'
      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
  ]
}
function updateUser() {
  if (!selectedUser.value || !newRole.value) return

  selectedUser.value.role = newRole.value

  localStorage.setItem('usuarios', JSON.stringify(usuarios.value))

  newRole.value = ''
}
</script>