<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-6">
      Designaciones de AA 
    </h2>


  <button
  class="px-4 py-2 bg-blue-500 text-white rounded-lg mb-6"
  @click="openModal"
>
  Designar
</button>




   
    <div class="bg-white rounded-2xl p-6">
      <h3 class="font-semibold mb-3">
        AA vigentes
      </h3>

      <p
        v-if="aaList.length === 0"
        class="text-sm text-slate-400"
      >
        No hay AA vigentes
      </p>

      <ul v-else class="space-y-2">
        <li
          v-for="(aa, index) in aaList"
          :key="aa.id"
          class="border rounded-lg p-3 flex justify-between items-center"
        >
          <span>
            {{ aa.nombre }} {{ aa.apellidos }}
          </span>

          <div class="flex gap-3">
            <button
              class="text-sm text-green-600"
              @click="confirmRatify(aa)"
            >
              Ratificar
            </button>

            <button
              class="text-sm text-red-500"
              @click="confirmRemove(index, aa)"
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
        Estudiantes 
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
        v-for="estudiante in estudiantes"
        :key="estudiante.id"
        class="border rounded-lg p-3 flex justify-between items-center hover:bg-slate-50"
      >
        <span>
          {{ estudiante.nombre }} {{ estudiante.apellidos }}
        </span>

        <button
          class="text-sm text-blue-500"
          @click="confirmAssign(estudiante)"
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

const estudiantes = ref([])
const aaList = ref([])
const showEstudiantes = ref(false)
const showModal = ref(false)


async function loadEstudiantes() {
  try {
    const response = await api.get('/estudiante')
    estudiantes.value = response.data.data
    showEstudiantes.value = true
  } catch (error) {
    alert('Error cargando estudiantes')
    console.error(error)
  }
}


function confirmAssign(estudiante) {
  const ok = confirm(
    `¿Desea asignar a ${estudiante.nombre} ${estudiante.apellidos} como AA?`
  )

  if (!ok) return


  const exists =aaList.value.some(a => a.id === estudiante.id)
  if (exists) return

  aaList.value.push(estudiante)
  syncAA()

 alert('estudiante asignado como AA')
showModal.value = false

}


function confirmRatify(estudiante) {
  const ok = confirm(
    `¿Desea ratificar como AA a ${estudiante.nombre} ${estudiante.apellidos}?`
  )

  if (!ok) return

  alert('AA ratificado')
}


function confirmRemove(index, estudiante) {
  const ok = confirm(
    `¿Está seguro de desnombrar como AA a ${estudiante.nombre} ${estudiante.apellidos}?`
  )

  if (!ok) return

  aaList.value.splice(index, 1)
  syncAA()

  alert(
    `Se ha desnombrado como AA al estudiante ${estudiante.nombre} ${estudiante.apellidos}`
  )
}

function syncAA() {
  localStorage.setItem('aaList', JSON.stringify(aaList.value))
}

function loadAA() {
  const stored = localStorage.getItem('aaList')
  if (stored) {
    aaList.value = JSON.parse(stored)
  }
}

onMounted(() => {
  loadAA()
})
async function openModal() {
  await loadEstudiantes()
  showModal.value = true
}

</script>

<style scoped>
button {
  cursor: pointer;
}
</style>
