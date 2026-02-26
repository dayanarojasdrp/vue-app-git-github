<template>
  <div class="flex h-screen">
    <Siderbar
      :active="active"
      @change="active = $event"
    />

    <main class="flex-1 bg-slate-100 p-6 overflow-auto">
     <Panel
  v-if="active === 'panel'"
  :key="panelKey"
/>

<Profesores v-if="active === 'profesores'" />
<Estudiantes v-if="active === 'estudiantes'" />
<Documentos v-if="active === 'documentos'" />

    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import Siderbar from './components/Siderbar.vue'
import Panel from './components/Panel.vue'
import Profesores from './components/Profesores.vue'
import Estudiantes from './components/Estudiantes.vue'
import Documentos from './components/Documentos.vue'
const active = ref('panel')


const panelKey = ref(0)

watch(active, (value) => {
  if (value === 'panel') {
    panelKey.value++
  }
})


</script>
