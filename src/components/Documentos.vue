<template>
 
<div class="documents-header mb-6">

  <div class="filters-box">
    <p class="filters-title">Filtrar</p>

    <div class="filters-content">
      <div>
        <label class="text-sm block mb-1">Periodos</label>
        <select v-model="filterPeriod" class="input">
          <option value="todos">Todos los periodos</option>
          <option value="2024">2024-2025</option>
          <option value="2025">2025-2026</option>
        </select>
      </div>

      <div>
        <label class="text-sm block mb-1">Roles</label>
        <select v-model="filterType" class="input">
          <option value="todos">PPA y AA</option>
          <option value="ppa">Solo PPA</option>
          <option value="aa">Solo AA</option>
        </select>
      </div>
    </div>
  </div>


  <button
    class="report-btn"
    @click="showReportModal = true"
  >
    Reporte histórico
  </button>
</div>



  <div class="bg-white rounded-2xl p-6">
    <p
      v-if="filteredDocuments.length === 0"
      class="text-slate-400 text-sm"
    >
      No hay documentos generados
    </p>

    <ul v-else class="space-y-3">
      <li
        v-for="(doc, index) in filteredDocuments"
        :key="index"
        class="border rounded-lg p-4 flex justify-between items-center"
      >
        <div>
          <p class="font-medium">
            {{ doc.title }}
          </p>
          <p class="text-xs text-slate-500">
            {{ doc.type.toUpperCase() }} · Periodo {{ doc.period }}
          </p>
        </div>

        <button class="text-blue-500 text-sm">
          Descargar
        </button>
      </li>
    </ul>
  </div>

 
  <div
    v-if="showReportModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl w-[400px] p-6">
      <h3 class="font-semibold mb-4">
        Reporte Histórico
      </h3>

      <div class="mb-4">
        <label class="text-sm block mb-1">Periodo</label>
        <input
          v-model="reportPeriod"
          class="input w-full"
          placeholder="Ej: 2023-2024"
        />
      </div>

      <div class="mb-6">
        <label class="text-sm block mb-1">Tipo</label>
        <select v-model="reportType" class="input w-full">
          <option value="ppa">PPA</option>
          <option value="aa">AA</option>
        </select>
      </div>

      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 border rounded-lg"
          @click="showReportModal = false"
        >
          Cancelar
        </button>

        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-lg"
          @click="generateHistoricalReport"
        >
          Generar
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
          Reporte generado
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
          El reporte histórico se ha generado correctamente
        </p>

        <p class="text-sm">
          <strong>Periodo:</strong> {{ reportPeriod }}
        </p>

        <p class="text-sm">
          <strong>Tipo:</strong> {{ reportType.toUpperCase() }}
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
import { ref, computed } from 'vue'


const documents = ref([])


const filterPeriod = ref('todos')
const filterType = ref('todos')


const showReportModal = ref(false)
const showSuccessModal = ref(false)


const reportPeriod = ref('')
const reportType = ref('ppa')


const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const byPeriod =
      filterPeriod.value === 'todos' ||
      doc.period === filterPeriod.value

    const byType =
      filterType.value === 'todos' ||
      doc.type === filterType.value

    return byPeriod && byType
  })
})

function generateHistoricalReport() {
  

  showReportModal.value = false
  showSuccessModal.value = true
}
</script>

<style scoped>
.documents-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}


.filters-box {
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.filters-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

.filters-content {
  display: flex;
  gap: 16px;
}


.input {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  background: #f8fafc;
  min-width: 200px;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
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


ul li {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  transition: transform 0.15s ease;
}

ul li:hover {
  transform: translateX(4px);
}

</style>
