<template>
 
  


  <div class="panel-container grid grid-cols-2 gap-6">

    <!-- PPA -->
    <section class="bg-white rounded-2xl p-6">
      <h3 class="font-semibold mb-4">
        Profesor Principal de Año (PPA)
      </h3>

      <div class="mt-4">
        <p v-if="ppaList.length === 0" class="text-sm text-slate-400">
          No hay PPA vigentes
        </p>

        <ul v-else class="space-y-2">
          <li
 v-for="ppa in ppaUnicos"
  :key="ppa.id"
  class="flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-xl px-3 py-2"
>
  <!-- IZQUIERDA -->
  <div class="flex items-center gap-3">

    <!-- 👤 ICONO -->
    <div class="w-8 h-8 flex items-center justify-center bg-slate-200 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M5.121 17.804A9 9 0 1118.879 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>

    <!-- TEXTO -->
    <div>
      <p class="text-sm font-medium leading-tight">
        {{ ppa.nombre }} {{ ppa.apellidos }}
      </p>

      <!-- 🔥 BURBUJAS PEQUEÑAS -->
      <div class="flex gap-1 mt-1 flex-wrap text-[10px]">
        
        <span class="px-2 py-[2px] bg-slate-200 text-slate-600 rounded-full">
          {{ ppa.catDocente }}
        </span>

        <span class="px-2 py-[2px] bg-purple-100 text-purple-600 rounded-full">
          {{ ppa.catCientifica }}
        </span>

      </div>
    </div>

  </div>
</li>
        </ul>
      </div>
    </section>

    <!-- AA -->
    <section class="bg-white rounded-2xl p-6">
      <h3 class="font-semibold mb-4">
        Alumno Ayudante (AA)
      </h3>
    
      <div class="mt-4">
        <p v-if="aaList.length === 0" class="text-sm text-slate-400">
          No hay AA vigentes
        </p>

       <ul v-else class="space-y-2">
  <li
    v-for="aa in aaList"
    :key="aa.key"
    class="flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-xl px-3 py-2"
  >
    <!-- IZQUIERDA -->
    <div class="flex items-center gap-3">

      <!-- 👤 ICONO -->
      <div class="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="w-4 h-4 text-blue-500"
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5.121 17.804A9 9 0 1118.879 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      <!-- TEXTO -->
      <div>
        <p class="text-sm font-medium leading-tight">
          {{ aa.nombre_completo }}
        </p>

        <!-- 🔥 BADGES -->
        <div class="flex gap-1 mt-1 flex-wrap text-[10px]">

          <!-- tutor -->
          <span class="px-2 py-[2px] bg-slate-200 text-slate-600 rounded-full">
            {{ aa.tutor }}
          </span>

          <!-- etapa -->
          <span class="px-2 py-[2px] bg-blue-100 text-blue-600 rounded-full">
           {{ aa.numero_carnet }}
          </span>

        </div>
      </div>

    </div>
  </li>
</ul>
      </div>
    </section>
  </div>


  <!-- ✅ MODAL CONFIGURACIÓN -->
  <div
    v-if="showConfigModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl w-[420px] p-6">
      <h3 class="text-lg font-semibold mb-4">
        Exportar Resolución
      </h3>

      <div class="mb-4">
        <p class="text-sm font-medium mb-2">
          Formato del documento
        </p>

        <label class="option">
          <input type="radio" value="pdf" v-model="format" />
          PDF
        </label>

        <label class="option">
          <input type="radio" value="word" v-model="format" />
          Word
        </label>
      </div>

      <div class="mb-6">
        <p class="text-sm font-medium mb-2">
          Tipo de resolución
        </p>

        <label class="option">
          <input type="radio" value="ppa" v-model="resolutionType" />
          Profesor Principal de Año (PPA)
        </label>

        <label class="option">
          <input type="radio" value="aa" v-model="resolutionType" />
          Alumno Ayudante (AA)
        </label>
      </div>

      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 rounded-lg border"
          @click="showConfigModal = false"
        >
          Cancelar
        </button>

        <button
          class="px-4 py-2 rounded-lg bg-blue-500 text-white"
          @click="confirmExport"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>





  <!-- ✅ MODAL ÉXITO -->
  <div
    v-if="showSuccessModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl w-[400px] p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-lg">
          Exportando documento
        </h3>

        <button
          class="text-slate-500"
          @click="showSuccessModal = false"
        >
          ✕
        </button>
      </div>

      <div class="mb-6">
        <p class="text-sm text-slate-500 mb-2">
          Detalles de la exportación
        </p>

        <p class="text-sm">
          <strong>Formato:</strong>
          {{ format.toUpperCase() }}
        </p>

        <p class="text-sm">
          <strong>Tipo:</strong>
          {{ resolutionType.toUpperCase() }}
        </p>
      </div>

      <div class="flex justify-end">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-lg"
          @click="showSuccessModal = false"
        >
          Aceptar
        </button>
      </div>
    </div>
  </div>

</template>


<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { computed } from 'vue'
import { filterByCurrentFaculty, filterStudentItemsByCurrentFaculty } from '../utiles/facultadScope'
const ppaList = ref([])
const aaList = ref([])

onMounted(() => {
  loadPPA()

  setInterval(() => {
    loadPPA()
  }, 3000) // cada 3 segundos
})

const format = ref('pdf')
const resolutionType = ref('ppa')

const showConfigModal = ref(false)
const showSuccessModal = ref(false)





function confirmExport() {
  console.log('Formato:', format.value)
  console.log('Resolución:', resolutionType.value)

  showConfigModal.value = false
  showSuccessModal.value = true
}


async function loadPPA() {
  try {
    const response = await api.get('/ppa')
    ppaList.value = await filterByCurrentFaculty(response.data)
  } catch (error) {
    console.error(error)
  }
}


const ppaUnicos = computed(() => {
  const mapa = new Map()

  ppaList.value.forEach(ppa => {
    if (!mapa.has(ppa.id)) {
      mapa.set(ppa.id, ppa)
    }
  })

  return Array.from(mapa.values())
})
onMounted(() => {
  loadPPA()
  loadAA()

  setInterval(() => {
    loadPPA()
    loadAA()
  }, 3000)
})
async function loadAA() {
  try {
    const res = await api.get('/alumno-ayudante/activos')
    const filteredAA = await filterStudentItemsByCurrentFaculty(res.data)
    aaList.value = deduplicateAA(filteredAA)
  } catch (error) {
    console.error(error)
  }
}

function normalizarTexto(texto = '') {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function getAAUniqueKey(aa) {
  return [
    normalizarTexto(aa.nombre_completo || `${aa.nombre || ''} ${aa.apellidos || ''}`),
    normalizarTexto(aa.tutor || aa.nombre_tutor || ''),
    String(aa.etapa ?? '').trim()
  ].join('|')
}

function deduplicateAA(items) {
  const map = new Map()

  items.forEach(aa => {
    const key = getAAUniqueKey(aa)

    if (!map.has(key)) {
      map.set(key, {
        ...aa,
        key
      })
    }
  })

  return Array.from(map.values())
}
</script>
