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
       <h1 class="text-xl font-semibold mb-1">
      Profesor Principal de Año (PPA)
    </h1>

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
 <DesignarModal
  v-model="showModal"
  :profesores="profesores"
/>
 <p class="text-xs text-slate-400">
          Lista de PPAs
          </p>


      <!-- 🔥 LISTA CON SCROLL (AQUÍ VA EL SCROLL BIEN HECHO) -->
      <div class="flex-1 overflow-y-auto border rounded-xl p-2">

        <p v-if="ppaList.length === 0" class="text-xs text-slate-400">
          No hay PPA vigentes
        </p>

        <ul v-else class="space-y-2">

          <li
            v-for="ppa in ppaList"
            :key="ppa.id"
            class="flex justify-between items-center bg-slate-50 rounded-lg px-2 py-1"
          >
            <div>
              <p class="text-sm font-medium">
                {{ ppa.nombre }} {{ ppa.apellidos }}
              </p>
              <p class="text-xs text-slate-400">
                PPA activo
              </p>
            </div>

            <div class="flex gap-2">
              <button
      class="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600"
      @click="confirmRatify(ppa)"
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
      @click="confirmRemove(ppa)"
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

        </ul>
      </div>

    </div>

  </div>

  <!-- 🔴 ACCIONES FIJAS ABAJO (SIN DOBLE DIV) -->
   <div class="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
    <div class="flex justify-end">
       <button
      class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
    >
      <!-- ICONO -->
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

</div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { cursoSeleccionado, anioSeleccionado } from '../store/context'
import DesignarModal from './DesignarModal.vue'
const profesores = ref([])
const ppaList = ref([])
const showProfesores = ref(false)
const showModal = ref(false)


async function loadProfesores() {
  try {
    const response = await api.get('/profesor')
    profesores.value = response.data.data
    showProfesores.value = true
  } catch (error) {
    alert('Error cargando profesores')
    console.error(error)
  }
}




async function confirmRatify(profesor) {
  openConfirm(
    `¿Desea ratificar a ${profesor.nombre}?`,
    async () => {
      try {
        await api.post('/ppa/ratificar', {
          id_profesor: profesor.id,
          id_curso: cursoSeleccionado.value,
          id_a_academico: anioSeleccionado.value
        })

        showToast('PPA ratificado correctamente', 'success')
        await loadPPA()

      } catch (error) {
        console.log(error.response)
        showToast('Error al ratificar', 'error')
      }
    }
  )
}


async function confirmRemove(profesor) {
  openConfirm(
    `¿Eliminar a ${profesor.nombre} como PPA?`,
    async () => {
      try {
        await api.post('/ppa/desnombrar', {
          id_profesor: profesor.id,
          id_curso: cursoSeleccionado.value,
          id_a_academico: anioSeleccionado.value
        })

        showToast('PPA eliminado correctamente', 'warning')
        await loadPPA()

      } catch (error) {
        console.log(error.response)
        showToast('Error al eliminar', 'error')
      }
    }
  )
}



async function loadPPA() {
  try {
    const response = await api.get('/ppa')
    ppaList.value = response.data
  } catch (error) {
    console.error(error)
    alert('Error cargando PPA')
  }
}

onMounted(() => {
  loadPPA()
})
async function openModal() {
  await loadProfesores()
  showModal.value = true
}
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

function showToast(msg, type = 'success') {
  toast.value.message = msg
  toast.value.type = type
  toast.value.show = true

  setTimeout(() => {
    toast.value.show = false
  }, 2500)
}
const confirmModal = ref({
  show: false,
  message: '',
  action: null
})
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
function asignar(profesor) {
  profesorSeleccionado.value = profesor
  showModal.value = true
}
</script>

<style scoped>
button {
  cursor: pointer;
}
</style>
