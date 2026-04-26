<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div>
      <h1 class="text-xl font-semibold text-slate-800">
        Gestión de Documentos
      </h1>
      <p class="text-sm text-slate-400">
        Todos los documentos generados en el sistema
      </p>
    </div>

    <!-- FILTROS -->
    <div class="bg-white rounded-2xl p-5 shadow-sm flex gap-6 items-end">

      <!-- PERIODO -->
      <div class="flex flex-col gap-1">
        <label class="label flex items-center gap-2">

          <!-- ICON -->
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>

          Periodo
        </label>

        <select v-model="filterPeriod" class="input">
          <option value="todos">Todos</option>

          <option
            v-for="curso in cursos"
            :key="curso.id"
            :value="curso.curso"
          >
            {{ curso.curso }}
          </option>
        </select>
      </div>

      <!-- TIPO -->
      <div class="flex flex-col gap-1">
        <label class="label flex items-center gap-2">

          <!-- ICON -->
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              d="M3 7h18M3 12h18M3 17h18"/>
          </svg>

          Tipo
        </label>

        <select v-model="filterType" class="input">
          <option value="todos">Todos</option>
          <option value="ppa">PPA</option>
          <option value="aa">AA</option>
        </select>
      </div>

    </div>

    <!-- LISTADO -->
    <div class="bg-white rounded-2xl p-4 shadow-sm">

      <div v-if="documents.length === 0" class="text-center py-10 text-slate-400">
        No hay documentos generados
      </div>

      <div v-else class="grid gap-3">

        <div
          v-for="doc in documents"
          :key="doc.id"
          class="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:shadow-sm hover:border-blue-200 transition"
        >

          <!-- INFO -->
          <div class="flex items-center gap-3">

            <!-- ICONO DOCUMENTO -->
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center"
              :class="doc.type === 'ppa' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12h6m-6 4h6M7 4h10l2 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"/>
              </svg>
            </div>

            <!-- TEXTO -->
            <div>
              <p class="text-sm font-medium text-slate-800">
                {{ doc.title }}
              </p>

              <p class="text-xs text-slate-400">
                {{ doc.type.toUpperCase() }} · {{ doc.period }}
              </p>
            </div>
          </div>

          <!-- BOTÓN -->
          <button
            @click="descargar(doc)"
            class="flex items-center gap-1 text-xs bg-slate-100 hover:bg-blue-500 hover:text-white text-slate-600 px-3 py-1 rounded-lg transition"
          >
            <!-- ICON DOWNLOAD -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0l-3 3m3-3l3 3"/>
            </svg>

            Descargar
          </button>

        </div>

      </div>
    </div>

  </div>
  <!-- 🔥 BOTÓN HISTORIAL FIJO -->
<div class="fixed bottom-6 right-6">
  <button
    @click="openModal = true"
    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2"
  >
     Historial
  </button>
</div>
<!-- 🔥 MODAL -->
<div v-if="openModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

  <div class="bg-white rounded-2xl p-6 w-[400px] space-y-4">

    <h2 class="text-lg font-semibold">Generar Historial</h2>

    <!-- TIPO -->
    <div>
      <label class="text-sm text-slate-500">Tipo</label>
      <select v-model="histTipo" class="input w-full">
        <option value="ppa">PPA</option>
        <option value="aa">AA</option>
      </select>
    </div>

    <!-- DESDE -->
    <div>
      <label class="text-sm text-slate-500">Desde</label>
      <select v-model="desde" class="input w-full">
        <option v-for="c in cursos" :key="c.id" :value="c.curso">
          {{ c.curso }}
        </option>
      </select>
    </div>

    <!-- HASTA -->
    <div>
      <label class="text-sm text-slate-500">Hasta</label>
      <select v-model="hasta" class="input w-full">
        <option v-for="c in cursos" :key="c.id" :value="c.curso">
          {{ c.curso }}
        </option>
      </select>
    </div>

    <!-- BOTONES -->
    <div class="flex justify-end gap-2 pt-2">
      <button @click="openModal = false" class="px-3 py-1 text-sm">
        Cancelar
      </button>

      <button
        @click="generarHistorial"
        class="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
      >
        Generar
      </button>
    </div>

  </div>
</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../api/axios'

// 🔥 estados
const cursos = ref([])
const documents = ref([])

const filterPeriod = ref('todos')
const filterType = ref('todos')
const openModal = ref(false)

const histTipo = ref('ppa')
const desde = ref('')
const hasta = ref('')

// 🔥 cargar documentos
async function cargarDocumentos() {
  try {
    const res = await api.get('/documentos', {
      params: {
        tipo: filterType.value,
        periodo: filterPeriod.value
      }
    })

    documents.value = res.data.map(doc => ({
      id: doc.id,
      title: doc.nombre,
      type: doc.tipo,
      period: doc.periodo,
      ruta: doc.ruta
    }))

  } catch (error) {
    console.error('Error documentos', error)
  }
}

// 🔥 cargar cursos (PERIODOS)
async function cargarCursos() {
  try {
    const res = await api.get('/cursos')

    cursos.value = res.data.data

    // 🔥 poner valores iniciales
    if (cursos.value.length) {
      desde.value = cursos.value[0].curso
      hasta.value = cursos.value[cursos.value.length - 1].curso
    }

  } catch (error) {
    console.error('Error cursos', error)
  }
}

// 🔥 descargar archivo
function descargar(doc) {
  const url = `http://localhost:8000/storage/${doc.ruta}`

  const link = document.createElement('a')
  link.href = url
  link.download = doc.title
  link.click()
}

// 🔥 watchers
watch([filterType, filterPeriod], cargarDocumentos)

// 🔥 init
onMounted(() => {
  cargarDocumentos()
  cargarCursos()
})
async function generarHistorial() {
  console.log("CLICK")

  if (!desde.value || !hasta.value) {
    alert("Selecciona rango de años")
    return
  }

  try {
    // 🔥 decidir ruta según tipo
    const url = histTipo.value === 'ppa'
      ? '/documentos/historial'
      : '/documentos/historial-aa'

    const res = await api.post(url, {
      desde: desde.value,
      hasta: hasta.value
    }, {
      responseType: 'blob'
    })

    console.log("OK BACK")

    if (!res.data || res.data.size === 0) {
      alert("No hay datos para ese rango")
      return
    }

    const blob = new Blob([res.data], { type: 'application/pdf' })
    const fileURL = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = fileURL
    link.download = `Historial_${histTipo.value}_${desde.value}_${hasta.value}.pdf`
    link.click()

    await cargarDocumentos()
    openModal.value = false

  } catch (error) {
    console.error("ERROR COMPLETO:", error)
    alert("Error generando historial")
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  background: #f8fafc;
}
</style>