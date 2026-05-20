<template>
  <div v-if="checkingSession" class="h-screen flex items-center justify-center bg-slate-100 text-slate-500">
    Verificando sesión...
  </div>

  <Login v-else-if="!isLogged" @login="handleLogin" />

  <div v-else class="flex h-screen">

    <!-- SIDEBAR -->
    <Siderbar
  :active="active"
  @change="active = $event"
  @openConfig="showConfig = true"
/>

    <!-- 🔵 COLUMNA DERECHA -->
    <div class="flex-1 flex flex-col">

      <!-- HEADER -->
<HeaderBar 
  @exportar="handleExport"
  :mostrarExportar="active === 'profesores' || active === 'estudiantes'"
/>



<ExportModal
  :show="showExportModal"
  :tipo="exportTipo"
  @close="showExportModal = false"
/>

<main class="flex-1 bg-slate-100 p-6 overflow-y-auto">
  <Panel v-if="active === 'panel'" :key="panelKey" />
  <Profesores v-if="active === 'profesores'" :key="'profesores'" />
<Estudiantes v-if="active === 'estudiantes'" :key="'estudiantes'" />
<Documentos v-if="active === 'documentos' && !isDepartmentHead" :key="'documentos'" />
<Usuarios v-if="active === 'usuarios'" :key="'usuarios'" />
</main>

    </div>

  </div>
  <ConfigModal 
  v-if="showConfig" 
  @close="showConfig = false" 
/>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue' 

import Siderbar from './components/Siderbar.vue'
import Panel from './components/Panel.vue'
import Profesores from './components/Profesores.vue'
import Estudiantes from './components/Estudiantes.vue'
import Documentos from './components/Documentos.vue'
import Login from './components/Login.vue'
import Usuarios from './components/Usuarios.vue'
import HeaderBar from './components/HeaderBar.vue'
import ConfigModal from './components/ConfigModal.vue'
import ExportModal from './components/ExportModal.vue'
import { isCurrentUserDepartmentHead } from './utiles/vicedecanos'
import { clearSession, getUser, saveSession } from './utiles/auth'
import { buildSessionFromAccess } from './utiles/sessionAccess'



const showExportModal = ref(false)


const showConfig = ref(false)
const active = ref('panel')
const panelKey = ref(0)
const isLogged = ref(false)
const exportTipo = ref(null)
const isDepartmentHead = ref(false)
const checkingSession = ref(true)
watch(active, (value) => {
  if (value === 'panel') {
    panelKey.value++
  }
})

onMounted(async () => {
  const user = getUser()
  const loginTime = localStorage.getItem('loginTime')

  if (loginTime) {
    const diff = Date.now() - loginTime
    const ONE_HOUR = 60 * 60 * 1000

    if (diff > ONE_HOUR) {
      clearSession()
      location.reload()
      return
    }
  }

  if (user?.username) {
    try {
      const updatedSession = await buildSessionFromAccess(user)

      if (updatedSession) {
        saveSession(updatedSession)
        isLogged.value = true
        isDepartmentHead.value = isCurrentUserDepartmentHead()

        if (isDepartmentHead.value && active.value === 'documentos') {
          active.value = 'panel'
        }
      } else {
        clearSession()
      }
    } catch (error) {
      clearSession()
    }
  }

  checkingSession.value = false
})

function handleLogin() {
  isLogged.value = true
}
function handleExport() {
  if (active.value === 'profesores') {
    exportTipo.value = 'ppa'
    showExportModal.value = true
  }

  if (active.value === 'estudiantes') {
    exportTipo.value = 'aa'
    showExportModal.value = true
  }
}
watch(active, () => {
  // 🔥 limpiar modales globalmente
  document.body.classList.remove('overflow-hidden')
})
</script>
