<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-6">
      Designaciones de PPA 
    </h2>


  <button
  class="px-4 py-2 bg-blue-500 text-white rounded-lg mb-6"
  @click="openModal"
>
  Designar
</button>




   
    <div class="bg-white rounded-2xl p-6">
      <h3 class="font-semibold mb-3">
        PPA vigentes
      </h3>

      <p
        v-if="ppaList.length === 0"
        class="text-sm text-slate-400"
      >
        No hay PPA vigentes
      </p>

      <ul v-else class="space-y-2">
        <li
          v-for="(ppa, index) in ppaList"
          :key="ppa.id"
          class="border rounded-lg p-3 flex justify-between items-center"
        >
          <span>
            {{ ppa.nombre }} {{ ppa.apellidos }}
          </span>

          <div class="flex gap-3">
            <button
              class="text-sm text-green-600"
              @click="confirmRatify(ppa)"
            >
              Ratificar
            </button>

            <button
              class="text-sm text-red-500"
              @click="confirmRemove(index, ppa)"
            >
              Desnombrar
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
 
<div
  v-if="showModal"
  class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
>
  <div class="bg-white rounded-2xl w-[500px] max-h-[80vh] p-6 overflow-y-auto">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-semibold text-lg">
        Profesores 
      </h3>

      <button
        class="text-slate-500"
        @click="showModal = false"
      >
        ✕
      </button>
    </div>

    <ul class="space-y-2">
      <li
        v-for="profesor in profesores"
        :key="profesor.id"
        class="border rounded-lg p-3 flex justify-between items-center hover:bg-slate-50"
      >
        <span>
          {{ profesor.nombre }} {{ profesor.apellidos }}
        </span>

        <button
          class="text-sm text-blue-500"
          @click="confirmAssign(profesor)"
        >
          Asignar
        </button>
      </li>
    </ul>
  </div>
</div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'

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


function confirmAssign(profesor) {
  const ok = confirm(
    `¿Desea asignar a ${profesor.nombre} ${profesor.apellidos} como PPA?`
  )

  if (!ok) return


  const exists = ppaList.value.some(p => p.id === profesor.id)
  if (exists) return

  ppaList.value.push(profesor)
  syncPPA()

 alert('Profesor asignado como PPA')
showModal.value = false

}


function confirmRatify(profesor) {
  const ok = confirm(
    `¿Desea ratificar como PPA a ${profesor.nombre} ${profesor.apellidos}?`
  )

  if (!ok) return

  alert('PPA ratificado')
}


function confirmRemove(index, profesor) {
  const ok = confirm(
    `¿Está seguro de desnombrar como PPA a ${profesor.nombre} ${profesor.apellidos}?`
  )

  if (!ok) return

  ppaList.value.splice(index, 1)
  syncPPA()

  alert(
    `Se ha desnombrado como PPA al profesor ${profesor.nombre} ${profesor.apellidos}`
  )
}

function syncPPA() {
  localStorage.setItem('ppaList', JSON.stringify(ppaList.value))
}

function loadPPA() {
  const stored = localStorage.getItem('ppaList')
  if (stored) {
    ppaList.value = JSON.parse(stored)
  }
}

onMounted(() => {
  loadPPA()
})
async function openModal() {
  await loadProfesores()
  showModal.value = true
}

</script>

<style scoped>
button {
  cursor: pointer;
}
</style>
