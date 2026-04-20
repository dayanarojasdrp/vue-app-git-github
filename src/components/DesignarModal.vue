<template>
<div v-if="modelValue" class="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">

    <div class="bg-white w-[420px] rounded-2xl p-6 shadow-2xl border border-slate-200">

      <div class="flex items-center gap-3 mb-6">
  <div class="bg-blue-100 p-2 rounded-xl">
    <AcademicCapIcon class="w-6 h-6 text-blue-600" />
  </div>
  <h2 class="text-xl font-semibold text-slate-700">
    Asignar PPA
  </h2>
</div>

      <!-- STEP 1: PROFESOR -->
      <div v-show="step === 1">
        <div class="flex items-center justify-between mb-3">

  <h3 class="text-sm font-semibold text-slate-700">
    Seleccionar Profesor
  </h3>

  <!-- BUSCADOR ANIMADO -->
  <div class="relative flex items-center">

    <!-- INPUT -->
    <input
      v-model="search"
      type="text"
      placeholder="Buscar..."
      class="transition-all duration-300 ease-in-out
             bg-slate-100 border border-slate-200
             text-sm rounded-full
             focus:outline-none focus:ring-2 focus:ring-blue-400
             px-3 py-1.5
             w-0 opacity-0
             peer-focus:w-48 peer-focus:opacity-100
             focus:w-48 focus:opacity-100"
    />

    <!-- ICONO -->
    <button
      class="absolute right-0 p-1.5 text-slate-500 hover:text-blue-500"
      @click="$refs.searchInput?.focus()"
    >
      <MagnifyingGlassIcon class="w-5 h-5" />
    </button>

  </div>

</div>
<div class="max-h-[300px] overflow-y-auto scroll-custom">
        <div
  v-for="prof in profesoresFiltrados"
  :key="prof.id"
  class="flex items-center justify-between bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all rounded-xl px-4 py-3 mb-2"
>
  <div class="flex items-center gap-3">
    <div class="bg-slate-100 p-2 rounded-full">
      <UserIcon class="w-5 h-5 text-slate-600" />
    </div>

    <p class="text-sm font-medium text-slate-700">
      {{ prof.nombre }} {{ prof.apellidos }}
    </p>
  </div>

  <button
    @click="selectProfesor(prof)"
    class="px-4 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm"
  >
    Asignar
  </button>
</div>
</div>

      </div>

      <!-- STEP 2: DEPARTAMENTO -->
      <div v-show="step === 2">
        <h3 class="mb-2">Seleccionar Departamento</h3>

        <div
  v-for="dep in departamentos"
  :key="dep.id"
  class="flex items-center gap-3 bg-white border hover:shadow rounded-xl px-4 py-3 mb-2 cursor-pointer"
  @click="selectDepartamento(dep)"
>
  <BuildingOfficeIcon class="w-5 h-5 text-blue-500" />

  <span class="text-sm text-slate-700 font-medium">
    {{ dep.nombre }}
  </span>
</div>
      </div>

      <!-- STEP 3: CARRERA -->
      <div v-show="step === 3">
        <h3 class="mb-2">Seleccionar Carrera</h3>

        <div
  v-for="c in carreras"
  :key="c.id"
  class="flex items-center gap-3 bg-white border hover:shadow rounded-xl px-4 py-3 mb-2 cursor-pointer"
  @click="selectCarrera(c)"
>
  <AcademicCapIcon class="w-5 h-5 text-purple-500" />

  <span class="text-sm text-slate-700 font-medium">
    {{ c.nombre }}
  </span>
</div>
      </div>

      <!-- STEP 4: AÑO -->
      <div v-show="step === 4">
        <h3 class="mb-2">Seleccionar Año Académico</h3>

        <div
  v-for="a in anios"
  :key="a.id"
  class="flex items-center gap-3 bg-white border hover:shadow rounded-xl px-4 py-3 mb-2 cursor-pointer"
  @click="selectAnio(a)"
>
  <CalendarDaysIcon class="w-5 h-5 text-green-500" />

  <span class="text-sm text-slate-700 font-medium">
    {{ a.identificador }}
  </span>
</div>
      </div>

      <!-- CANCEL -->
      <button
  @click="$emit('update:modelValue', false)"
  class="mt-6 w-full py-2 rounded-xl border border-red-300 text-red-500 hover:bg-red-50 transition"
>
  Cancelar
</button>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '../api/axios'
import {
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  CalendarDaysIcon
} from '@heroicons/vue/24/outline'
import {  computed } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
const search = ref('')
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: Boolean,
  profesores: Array // 🔥 ahora recibes la lista completa
})

const step = ref(1)

const profesorSeleccionado = ref(null)
const departamentos = ref([])
const carreras = ref([])
const anios = ref([])

const departamentoSeleccionado = ref(null)
const carreraSeleccionada = ref(null)
const anioSeleccionado = ref(null)
const profesoresFiltrados = computed(() => {
  if (!search.value) return props.profesores

  const busqueda = normalizarTexto(search.value)

  return props.profesores.filter(prof => {
    const nombreCompleto = normalizarTexto(
      `${prof.nombre} ${prof.apellidos}`
    )

    return nombreCompleto.includes(busqueda)
  })
})

// 🔥 CUANDO ABRE
watch(() => props.modelValue, async (val) => {
  if (val) {
    step.value = 1
    profesorSeleccionado.value = null
    departamentos.value = []
    carreras.value = []
    anios.value = []
    search.value = '' // 🔥 LIMPIA EL BUSCADOR
  }
})


// ✅ STEP 1
async function selectProfesor(prof) {
 

  profesorSeleccionado.value = prof
  await cargarDepartamentos()
  step.value = 2
}


// ✅ STEP 2
async function cargarDepartamentos() {
  try {
    const res = await api.get('/facultad/1/departamentos')

    console.log('DEPARTAMENTOS:', res.data) // 👈 DEBUG

    departamentos.value = res.data
  } catch (error) {
    console.error('Error cargando departamentos:', error)
  }
}

function selectDepartamento(dep) {
  departamentoSeleccionado.value = dep

  cargarCarreras(dep.id)

  step.value = 3
}


// ✅ STEP 3
async function cargarCarreras(idDepartamento) {
  try {
    const res = await api.get(`/departamento/${idDepartamento}/carreras`)

    console.log('CARRERAS:', res.data) // 👈 DEBUG

    carreras.value = res.data
  } catch (error) {
    console.error('Error cargando carreras:', error)
  }
}

function selectCarrera(c) {
  carreraSeleccionada.value = c

  cargarAnios(c.id)

  step.value = 4
}


// ✅ STEP 4
async function cargarAnios(idProgForm) {
  try {
    const res = await api.get(`/programa/${idProgForm}/anios`)

    console.log('AÑOS:', res.data) // 👈 DEBUG

    anios.value = res.data
  } catch (error) {
    console.error('Error cargando años:', error)
  }
}

async function selectAnio(a) {
  try {
    anioSeleccionado.value = a

    const cursoRes = await api.get(`/anio/${a.id}/curso`)

    console.log('CURSO:', cursoRes.data) // 👈 DEBUG

    const cursoId = cursoRes.data.id_curso

    await crearPPA(cursoId)

  } catch (error) {
    console.error('Error obteniendo curso:', error)
    alert('Error obteniendo curso')
  }
}


async function crearPPA(idCurso) {
  try {
    await api.post('/ppa/designar', {
      id_profesor: profesorSeleccionado.value.id,
      id_a_academico: anioSeleccionado.value.id,
      id_curso: idCurso
    })

    alert(`Se asignó correctamente a ${profesorSeleccionado.value.nombre} como PPA de ${carreraSeleccionada.value.nombre} (${anioSeleccionado.value.identificador})`)

    emit('update:modelValue', false)

  } catch (error) {
    console.error(error)
    alert(error.response?.data?.error || 'Error al asignar')
  }
}
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD') // separa letras de tildes
    .replace(/[\u0300-\u036f]/g, '') // elimina tildes
}
</script>

<style>
.btn {
  width: 100%;
  padding: 8px;
  background: #f1f5f9;
  border-radius: 10px;
}
.btn:hover {
  background: #e2e8f0;
}

.scroll-custom::-webkit-scrollbar {
  width: 6px;
}

.scroll-custom::-webkit-scrollbar-thumb {
  background: #cbd5f5;
  border-radius: 10px;
}

</style>