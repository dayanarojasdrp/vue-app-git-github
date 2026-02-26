<template>
 
  <div class="flex justify-between items-center mb-6">
   <h2 class="text-2xl font-bold text-slate-800">

      PPA y AA
    </h2>

    <button
    class="report-btn"
    @click="showSuccessModal = true"
  >
      Exportar
    </button>
  </div>


  <div class="panel-container grid grid-cols-2 gap-6">


    <section class="bg-white rounded-2xl p-6">
      <h3 class="font-semibold mb-4">
        Profesor Principal de Año (PPA)
      </h3>

<div class="mt-4">
 

  <p
    v-if="ppaList.length === 0"
    class="text-sm text-slate-400"
  >
    No hay PPA vigentes
  </p>

  <ul v-else class="space-y-2">
   <li
  v-for="ppa in ppaList"
  :key="ppa.id"
  class="role-item"
>

  <span>
    {{ ppa.nombre }} {{ ppa.apellidos }}
  </span>

  <button
  class="btn-explore"
  @click="explorarPPA(ppa)"
>

    Explorar
  </button>
</li>

  </ul>
</div>

      

   
    </section>


   <section class="role-card">

      <h3 class="font-semibold mb-4">
        Alumno Ayudante (AA)
      </h3>
    
<div class="mt-4">
  

  <p
    v-if="aaList.length === 0"
    class="text-sm text-slate-400"
  >
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


  <div
 v-if="showSuccessModal">


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
          <input
            type="radio"
            value="pdf"
            v-model="format"
          />
          PDF
        </label>

        <label class="option">
          <input
            type="radio"
            value="word"
            v-model="format"
          />
          Word
        </label>
      </div>

      
      <div class="mb-6">
        <p class="text-sm font-medium mb-2">
          Tipo de resolución
        </p>

        <label class="option">
          <input
            type="radio"
            value="ppa"
            v-model="resolutionType"
          />
          Profesor Principal de Año (PPA)
        </label>

        <label class="option">
          <input
            type="radio"
            value="aa"
            v-model="resolutionType"
          />
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
      <p class="text-sm text-slate-500 mb-1">
        Profesor
      </p>
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
  const stored = localStorage.getItem('ppaList')
  if (stored) {
    ppaList.value = JSON.parse(stored)
  }
})


const format = ref('pdf')
const resolutionType = ref('ppa')

const showConfigModal = ref(false)
const showSuccessModal = ref(false)


const selectedPPA = ref(null)
const showExploreModal = ref(false)


const catDocenteName = ref('')
const catCientificaName = ref('')


function closeModal() {
  showConfigModal.value = false
}

function confirmExport() {
  console.log('Formato:', format.value)
  console.log('Resolución:', resolutionType.value)

  showConfigModal.value = false
  showSuccessModal.value = true
}


async function explorarPPA(ppa) {
  selectedPPA.value = ppa

  catDocenteName.value = ''
  catCientificaName.value = ''

  try {
    const catDocenteResponse = await axios.get(
      `http://localhost:8000/api/categoria_docente/${ppa.idCatDocente}`
    )

    const catCientificaResponse = await axios.get(
      `http://localhost:8000/api/categoria_cientifica/${ppa.idCatCientifica}`
    )

    catDocenteName.value =
      catDocenteResponse.data.data?.nombre || 'No definida'

    catCientificaName.value =
      catCientificaResponse.data.data?.nombre || 'No definida'

  } catch (error) {
    console.error('Error cargando categorías', error)
    catDocenteName.value = 'Error'
    catCientificaName.value = 'Error'
  }

  showExploreModal.value = true
}

</script>


<style scoped>

.panel-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}


section {
  background: #ffffff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

section:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
}


h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}


.role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 14px 18px;
  border-radius: 16px;

  background: linear-gradient(
    135deg,
    #f8fafc,
    #f1f5f9
  );

  font-size: 14px;
  font-weight: 500;
  color: #334155;

  transition:
    background 0.25s ease,
    transform 0.15s ease;
}

.role-item:hover {
  background: linear-gradient(
    135deg,
    #eef2ff,
    #e0e7ff
  );
  transform: translateX(4px);
}


.btn-explore {
  font-size: 13px;
  font-weight: 600;

  color: #2563eb;
  background: rgba(37, 99, 235, 0.1);

  padding: 6px 16px;
  border-radius: 999px;

  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.btn-explore:hover {
  background: rgba(37, 99, 235, 0.2);
  transform: scale(1.05);
}


.option {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 14px;
  border-radius: 12px;

  background: #f8fafc;
  font-size: 14px;

  cursor: pointer;
  transition: background 0.2s ease;
}

.option:hover {
  background: #eef2ff;
}

.option input {
  accent-color: #2563eb;
}


.fixed > div {
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
}


button {
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

button:hover {
  transform: translateY(-1px);
}
.report-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.report-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 35px rgba(37, 99, 235, 0.45);
}

</style>
