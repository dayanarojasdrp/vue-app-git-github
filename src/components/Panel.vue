<template>
 
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-slate-800">
      PPA y AA
    </h2>

    <button
      class="report-btn"
      @click="showConfigModal = true"
    >
      Exportar
    </button>
  </div>


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
  v-for="ppa in ppaList"
  :key="ppa.id"
  class="flex justify-between items-center border rounded-lg p-3"
>
  <span>
    {{ ppa.nombre }} {{ ppa.apellidos }}
  </span>

  <button
    class="text-sm text-blue-500"
    @click="explorarPPA(ppa)"
  >
    Explorar
  </button>
</li>
        </ul>
      </div>
    </section>

    <!-- AA -->
    <section class="role-card">
      <h3 class="font-semibold mb-4">
        Alumno Ayudante (AA)
      </h3>
    
      <div class="mt-4">
        <p v-if="aaList.length === 0" class="text-sm text-slate-400">
          No hay AA vigentes
        </p>

        <ul v-else class="space-y-2">
          <li
            v-for="(aa, index) in aaList"
            :key="index"
            class="border rounded-lg p-3"
          >
            {{ aa }}
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


  <!-- 🔍 MODAL EXPLORAR -->
  <div
    v-if="showExploreModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl w-[400px] p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-lg">
          Profesor Principal de Año
        </h3>

        <button
          class="text-slate-500"
          @click="showExploreModal = false"
        >
          ✕
        </button>
      </div>

      <div class="mb-6">
        <p class="text-sm text-slate-500 mb-1">Profesor</p>
        <p class="font-medium">
          {{ selectedPPA?.nombre }} {{ selectedPPA?.apellidos }}
        </p>

        <div class="mb-4">
          <p class="text-sm text-slate-500">Categoría Docente</p>
          <p class="font-medium">
            {{ catDocenteName }}
          </p>
        </div>

        <div class="mb-4">
          <p class="text-sm text-slate-500">Categoría Científica</p>
          <p class="font-medium">
            {{ catCientificaName }}
          </p>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-lg"
          @click="showExploreModal = false"
        >
          Cerrar
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
import axios from 'axios'

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

const selectedPPA = ref(null)
const showExploreModal = ref(false)

const catDocenteName = ref('')
const catCientificaName = ref('')

function confirmExport() {
  console.log('Formato:', format.value)
  console.log('Resolución:', resolutionType.value)

  showConfigModal.value = false
  showSuccessModal.value = true
}

async function explorarPPA(ppa) {
  selectedPPA.value = ppa

  catDocenteName.value = ppa.catDocente
  catCientificaName.value = ppa.catCientifica

  showExploreModal.value = true
}
async function loadPPA() {
  try {
    const response = await axios.get('http://localhost:8000/api/ppa')
    ppaList.value = response.data
  } catch (error) {
    console.error(error)
  }
}
</script>
