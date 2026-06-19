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

      <button v-if="canViewDocuments" class="link" :class="{ active: active === 'documentos' }" @click="$emit('change', 'documentos')">
  <DocumentTextIcon class="w-5 h-5 mr-3" />
  Documentos
</button>

      <button v-if="canViewResolucion" class="link" :class="{ active: active === 'resolucion' }" @click="$emit('change', 'resolucion')">
  <DocumentCheckIcon class="w-5 h-5 mr-3" />
  Resolución
</button>

    </nav>
<div v-if="canOpenConfig" class="px-3 pb-2">
 <button
  class="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition text-sm"
  @click="$emit('openConfig')"
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
        {{ displayName }}
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
  <p class="font-semibold text-slate-800">{{ displayName }}</p>
  <p class="text-xs text-blue-500 font-medium">{{ user?.role }}</p>
</div>

    <div class="border-t pt-3 space-y-2">
      <button
  @click="showPerfil = true"
  class="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-blue-50 transition text-slate-700"
>
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

  </aside>
  <PerfilModal
  :show="showPerfil"
  @close="showPerfil = false"
/>
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
defineEmits(['change', 'openConfig'])
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import PerfilModal from './PerfilModal.vue'
import { clearSession, getUser } from '../utiles/auth'
const showPerfil = ref(false)
const menuRef = ref(null)
const user = ref(null)
const showMenu = ref(false)

onMounted(() => {
  user.value = getUser()
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
  return displayName.value
    ? displayName.value.charAt(0).toUpperCase()
    : '?'
})

const displayName = computed(() => user.value?.name ?? user.value?.username ?? 'Usuario')

const canOpenConfig = computed(() => {
  return ['vicedecano_docente', 'decano'].includes(user.value?.role)
})

const canViewDocuments = computed(() => {
  return user.value?.role !== 'jefe_departamento'
})

const canViewResolucion = computed(() => {
  return ['vicedecano_docente', 'decano'].includes(user.value?.role)
})

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function logout() {
  clearSession()
  location.reload()
}
import {
  Squares2X2Icon,
  UserGroupIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  DocumentCheckIcon
} from '@heroicons/vue/24/outline'
</script>
