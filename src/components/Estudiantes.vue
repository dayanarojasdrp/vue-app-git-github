<template>

  <div
  v-if="confirmModal.show"
  class="fixed inset-0 z-[9999] flex items-center justify-center"
>
  <div
    class="absolute inset-0 bg-black/30 backdrop-blur-sm"
    @click="confirmModal.show = false"
  ></div>

  <div class="relative bg-white rounded-2xl p-6 w-[400px] shadow-xl">

    <p class="text-sm text-slate-700 mb-6">
      {{ confirmModal.message }}
    </p>

    <div class="flex justify-end gap-3">
      <button
        @click="confirmModal.show = false"
        class="px-4 py-2 text-sm rounded-full bg-slate-100"
      >
        Cancelar
      </button>

      <button
        @click="handleConfirm"
        class="px-4 py-2 text-sm rounded-full bg-blue-500 text-white"
      >
        Aceptar
      </button>
    </div>

  </div>
</div>
  <div
  v-if="toast.show"
  class="fixed top-6 right-6 z-[9999] px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2"
  :class="{
    'bg-white text-green-600 border-green-200': toast.type === 'success',
    'bg-white text-red-600 border-red-200': toast.type === 'error',
    'bg-white text-yellow-600 border-yellow-200': toast.type === 'warning'
  }"
>
  <span>
    {{ toast.type === 'success' ? '✔' : toast.type === 'error' ? '✖' : '⚠' }}
  </span>

  <span class="text-sm">{{ toast.message }}</span>
</div>
  <div class="h-full flex flex-col">

  <!-- 🔵 CONTENIDO -->
  <div class="flex-1 flex flex-col p-3">

    <!-- CARD PRINCIPAL -->
    <div class="bg-white rounded-2xl border p-4 shadow-sm flex flex-col flex-1">

      <!-- HEADER -->
       <div class="flex items-center justify-between mb-2">

  <h1 class="text-xl font-semibold">
    Alumno Ayudante (AA)
  </h1>

  <!-- 🔍 BUSCADOR -->
  <div class="relative flex items-center">

  <!-- INPUT (OCULTO / ANIMADO) -->
  <input
    v-model="searchAA"
    type="text"
    placeholder="Buscar..."
    class="absolute right-8 transition-all duration-300 ease-in-out
           bg-slate-100 border border-slate-200
           text-sm rounded-full
           focus:outline-none focus:ring-2 focus:ring-blue-400
           py-1.5"
    :class="searchOpenAA 
      ? 'w-48 px-3 opacity-100' 
      : 'w-0 px-0 opacity-0'"
  />

  <!-- LUPA -->
  <button
    @click="toggleSearchAA"
    class="p-1.5 text-slate-500 hover:text-blue-500 transition"
  >
    <svg xmlns="http://www.w3.org/2000/svg" 
         class="w-5 h-5" 
         fill="none" 
         viewBox="0 0 24 24" 
         stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z" />
    </svg>
  </button>

</div>

</div>

      <!-- BOTÓN -->
      <button
  class="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition w-fit"
  @click="openModal"
>
  <!-- ICONO PERSONA -->
  <svg xmlns="http://www.w3.org/2000/svg" 
       class="w-5 h-5" 
       fill="none" 
       viewBox="0 0 24 24" 
       stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M15 12a4 4 0 10-8 0 4 4 0 008 0zm6 8a6 6 0 00-12 0h12z" />
  </svg>

  Designar
</button>
<DesignarModalA
  v-model="showModal"
  :estudiantes="estudiantes"
  @aa-creado="loadAA"
  :aa-list="aaList"
/>
 <p class="text-xs text-slate-400">
          Lista de AAs
          </p>


      <!-- 🔥 LISTA CON SCROLL (AQUÍ VA EL SCROLL BIEN HECHO) -->
      <div class="flex-1 overflow-y-auto border rounded-xl p-2">

        <p v-if="aaList.length === 0" class="text-xs text-slate-400">
          No hay AA vigentes
        </p>

        <ul v-else class="space-y-2">

          <li
            v-for="aa in aaFiltrados"
            :key="aa.key"
            class="flex justify-between items-center bg-slate-50 rounded-lg px-2 py-1"
          >
            <div>
             <p class="text-sm font-medium">
  {{ aa.nombre_completo }}
</p>
              <div class="flex gap-2 mt-1 flex-wrap text-xs">
  <!-- Departamento -->
  <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
    {{ aa.tutor }}
  </span>

  <!-- Carrera -->
  <span class="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
    Etapa {{ aa.etapa }}
  </span>

  <!-- Año -->
  
</div>
            </div>

            <div class="flex gap-2">
              <button
      class="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600"
      @click="confirmRatify(aa)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
           fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
           class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M5 13l4 4L19 7" />
      </svg>
      Ratificar
    </button>
              <button
      class="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-red-100 text-red-600"
      @click="confirmRemove(aa)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
           fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
           class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M6 7h12M9 7v10m6-10v10M10 11v6m4-6v6" />
      </svg>
      Desnombrar
    </button>
            </div>
          </li>
<p v-if="aaFiltrados.length === 0" class="text-xs text-slate-400 text-center py-3">
  No se encontraron resultados
</p>
        </ul>
      </div>

    </div>

  </div>

  <!-- 🔴 ACCIONES FIJAS ABAJO (SIN DOBLE DIV) -->
   <div class="fixed bottom-6 right-6 z-50">
  <button
  @click="showResolucionModal = true"
  class="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
>
    <svg xmlns="http://www.w3.org/2000/svg" 
         fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
         class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M12 16v-8m0 0l-3 3m3-3l3 3M4 20h16" />
    </svg>

    Generar Resolución Decanal
  </button>
</div>

</div>
<ResolucionModal
  :show="showResolucionModal"
  tipo="aa"
  @close="showResolucionModal = false"
/>
</template>



<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api/axios'
import DesignarModalA from './DesignarModalA.vue'
import ResolucionModal from './ResolucionModal.vue'

// =======================
// 🔹 ESTADO
// =======================
const searchAA = ref('')
const searchOpenAA = ref(false)

const estudiantes = ref([])
const aaList = ref([])

const showModal = ref(false)
const showResolucionModal = ref(false)

// Toast
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Confirm modal
const confirmModal = ref({
  show: false,
  message: '',
  action: null
})
import { onUnmounted } from 'vue'
import { filterStudentItemsByCurrentFaculty, filterStudentsByCurrentFaculty } from '../utiles/facultadScope'
// =======================
// 🔹 LOADERS
// =======================
async function loadEstudiantes() {
  try {
    const res = await api.get('/estudiante')
    const data = res.data.data ?? res.data
    estudiantes.value = await filterStudentsByCurrentFaculty(data)
  } catch (error) {
    console.error(error)
    showToast('Error cargando estudiantes', 'error')
  }
}

async function loadAA() {
  try {
    const res = await api.get('/alumno-ayudante/activos')
    const filteredAA = await filterStudentItemsByCurrentFaculty(res.data)
    aaList.value = deduplicateAA(filteredAA)
  } catch (error) {
    console.error(error)
    showToast('Error cargando AA', 'error')
  }
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
onMounted(() => {
  loadAA()
})

// =======================
// 🔹 ACCIONES AA
// =======================

// 🔥 RATIFICAR
async function confirmRatify(aa) {
  openConfirm(
    `¿Desea ratificar a ${aa.nombre} ${aa.apellidos}?`,
    async () => {
      try {
        await api.post(`/alumno-ayudante/ratificar/${aa.id}`)
        showToast('AA ratificado correctamente', 'success')
        await loadAA()
      } catch (error) {
        console.error(error.response || error)
        showToast(
          error.response?.data?.error || 'Error al ratificar',
          'error'
        )
      }
    }
  )
}

// 🔥 DESNOMBRAR
async function confirmRemove(aa) {
  openConfirm(
    `¿Desnombrar a ${aa.nombre} ${aa.apellidos} como AA?`,
    async () => {
      try {
        await api.post(`/alumno-ayudante/desnombrar/${aa.id}`)
        showToast('AA desnombrado correctamente', 'warning')
        await loadAA()
      } catch (error) {
        console.error(error.response || error)
        showToast(
          error.response?.data?.error || 'Error al desnombrar',
          'error'
        )
      }
    }
  )
}

// =======================
// 🔹 MODAL DESIGNAR
// =======================
async function openModal() {
  await loadEstudiantes()
  showModal.value = true
}

// =======================
// 🔹 TOAST
// =======================
function showToast(msg, type = 'success') {
  toast.value.message = msg
  toast.value.type = type
  toast.value.show = true

  setTimeout(() => {
    toast.value.show = false
  }, 2500)
}

// =======================
// 🔹 CONFIRM
// =======================
function openConfirm(message, action) {
  confirmModal.value = {
    show: true,
    message,
    action
  }
}

async function handleConfirm() {
  if (confirmModal.value.action) {
    await confirmModal.value.action()
  }
  confirmModal.value.show = false
}

// =======================
// 🔹 BUSCADOR
// =======================
function normalizarTexto(texto = '') {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const aaFiltrados = computed(() => {
  if (!searchAA.value) return aaList.value

  const busqueda = normalizarTexto(searchAA.value)

  return aaList.value.filter(aa => {
    const nombreCompleto = normalizarTexto(
      `${aa.nombre || ''} ${aa.apellidos || ''}`
    )
    return nombreCompleto.includes(busqueda)
  })
})

function toggleSearchAA() {
  searchOpenAA.value = !searchOpenAA.value

  if (searchOpenAA.value) {
    setTimeout(() => {
      document.querySelector('input[placeholder="Buscar..."]')?.focus()
    }, 200)
  } else {
    searchAA.value = ''
  }
}

// =======================
// 🔹 EXPORT / RESOLUCIÓN
// =======================
function exportarEstudiante() {
  // si usas modal de export
  console.log('Exportar AA')
}

// =======================
// 🔹 EXPUESTO AL TEMPLATE
// =======================
// (script setup ya expone todo automáticamente)


onUnmounted(() => {
  confirmModal.value.show = false
  toast.value.show = false
  showModal.value = false
  showResolucionModal.value = false
})
</script>

<style scoped>
button {
  cursor: pointer;
}
</style>
