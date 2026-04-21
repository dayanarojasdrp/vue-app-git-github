<template>
  <Login v-if="!isLogged" @login="handleLogin" />

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
      <HeaderBar @exportar="handleExport" />



<ExportModal
  :show="showExportModal"
  @close="showExportModal = false"
/>

<main class="flex-1 bg-slate-100 p-6 overflow-y-auto">
  <Panel v-if="active === 'panel'" :key="panelKey" />
  <Profesores v-if="active === 'profesores'" />
  <Estudiantes v-if="active === 'estudiantes'" />
  <Documentos v-if="active === 'documentos'" />
  <Usuarios v-if="active === 'usuarios'" />
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



const showExportModal = ref(false)


const showConfig = ref(false)
const active = ref('panel')
const panelKey = ref(0)
const isLogged = ref(false)

watch(active, (value) => {
  if (value === 'panel') {
    panelKey.value++
  }
})

onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) isLogged.value = true

  // ⏱️ AUTO LOGOUT
  const loginTime = localStorage.getItem('loginTime')
  if (loginTime) {
    const diff = Date.now() - loginTime
    const ONE_HOUR = 60 * 60 * 1000

    if (diff > ONE_HOUR) {
      localStorage.removeItem('user')
      localStorage.removeItem('loginTime')
      location.reload()
    }
  }
})

function handleLogin() {
  isLogged.value = true
}
function handleExport() {
  if (active.value === 'profesores') {
    showExportModal.value = true
  }

  if (active.value === 'estudiantes') {
    console.log('Exportar estudiantes')
  }
}
</script>