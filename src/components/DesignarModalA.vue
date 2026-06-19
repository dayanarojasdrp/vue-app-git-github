<template>
<div v-if="modelValue" class="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-[10000]">

    <div class="relative bg-white w-[420px] rounded-2xl p-6 shadow-2xl border border-slate-200">

      <div class="flex items-center justify-between mb-6">

  <div class="flex items-center gap-3">
    <div class="bg-blue-100 p-2 rounded-xl">
      <AcademicCapIcon class="w-6 h-6 text-blue-600" />
    </div>

  <h2 class="text-xl font-semibold text-slate-700">
  Asignar Alumno Ayudante
</h2>
  </div>

  <!-- ❌ BOTÓN CERRAR -->
  <button
    @click="$emit('update:modelValue', false)"
    class="text-slate-400 hover:text-red-500 transition"
  >
    <XMarkIcon class="w-6 h-6" />
  </button>

</div>

      <!-- STEP 1: PROFESOR -->
     <!-- STEP 1: ESTUDIANTE -->
<div v-show="step === 1">

  <div class="flex items-center justify-between mb-3">

    <h3 class="text-sm font-semibold text-slate-700">
      Seleccionar Estudiante
    </h3>

    <!-- BUSCADOR -->
    <div class="relative flex items-center">
      <input
  ref="searchInput"
  v-model="search"
        type="text"
        placeholder="Buscar..."
        class="transition-all duration-300 ease-in-out
               bg-slate-100 border border-slate-200
               text-sm rounded-full
               focus:outline-none focus:ring-2 focus:ring-blue-400
               px-3 py-1.5"
        :class="searchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0 px-0'"
      />

      <button
        class="absolute right-0 p-1.5 text-slate-500 hover:text-blue-500"
        @click="toggleSearch"
      >
        <MagnifyingGlassIcon class="w-5 h-5" />
      </button>
    </div>

  </div>

  <div class="max-h-[300px] overflow-y-auto scroll-custom">

    <div
      v-for="est in estudiantesFiltrados"
      :key="est.id"
      class="flex items-center justify-between bg-white border hover:border-blue-400 hover:shadow rounded-xl px-4 py-3 mb-2"
    >
      <div class="flex items-center gap-3">
        <div class="bg-slate-100 p-2 rounded-full">
          <UserIcon class="w-5 h-5 text-slate-600" />
        </div>

        <p class="text-sm font-medium text-slate-700">
          {{ est.nombre }} {{ est.apellidos }}
        </p>
      </div>

      <button
        @click="selectEstudiante(est)"
        class="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-full"
      >
        Seleccionar
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
<div v-if="departamentos.length === 0" class="text-sm text-slate-400">
  No hay departamentos disponibles
</div>
      </div>

      <!-- STEP 3: CARRERA -->
<!-- STEP 3: PROFESOR -->
<div v-show="step === 3">

  <!-- HEADER + LUPA -->
  <div class="flex items-center justify-between mb-3">

    <h3 class="text-sm font-semibold text-slate-700">
      Seleccionar Tutor
    </h3>

    <!-- 🔍 BUSCADOR -->
    <div class="relative flex items-center">
      <input
      ref="searchInput"
        v-model="searchProf"
        type="text"
        placeholder="Buscar..."
        class="transition-all duration-300 ease-in-out
               bg-slate-100 border border-slate-200
               text-sm rounded-full
               focus:outline-none focus:ring-2 focus:ring-blue-400
               px-3 py-1.5"
        :class="searchOpenProf ? 'w-48 opacity-100' : 'w-0 opacity-0 px-0'"
      />

      <button
        class="absolute right-0 p-1.5 text-slate-500 hover:text-blue-500"
        @click="toggleSearchProf"
      >
        <MagnifyingGlassIcon class="w-5 h-5" />
      </button>
    </div>

  </div>

  <!-- 🔥 LISTA CON SCROLL -->
  <div class="max-h-[260px] overflow-y-auto scroll-custom">

    <div
      v-for="prof in profesoresFiltrados"
      :key="prof.id"
      class="flex items-center justify-between bg-white border hover:border-blue-400 hover:shadow rounded-xl px-4 py-3 mb-2"
    >
      <div class="flex items-center gap-3">
        <div class="bg-blue-100 p-2 rounded-full">
          <UserIcon class="w-5 h-5 text-blue-600" />
        </div>

        <span class="text-sm text-slate-700 font-medium">
          {{ prof.nombre }} {{ prof.apellidos }}
        </span>
      </div>

      <button
        @click="selectProfesor(prof)"
        class="px-3 py-1 text-sm bg-blue-500 text-white rounded-full"
      >
        Elegir
      </button>
    </div>

    <!-- vacío -->
    <p v-if="profesoresFiltrados.length === 0"
       class="text-xs text-slate-400 text-center py-3">
      No se encontraron profesores
    </p>

  </div>

</div>

   <!-- STEP 4: ASIGNATURA -->
<div v-show="step === 4">

  <h3 class="text-sm font-semibold text-slate-700 mb-4">
    Seleccionar Asignatura
  </h3>

  <div class="relative flex items-center mb-3">
    <input
      v-model="searchAsignatura"
      type="text"
      placeholder="Buscar asignatura..."
      class="w-full bg-slate-100 border border-slate-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5"
    />
  </div>

  <div class="max-h-[260px] overflow-y-auto scroll-custom">
    <div
      v-for="asignatura in asignaturasFiltradas"
      :key="asignatura.id"
      class="flex items-center justify-between bg-white border hover:border-blue-400 hover:shadow rounded-xl px-4 py-3 mb-2"
    >
      <div class="flex items-center gap-3">
        <div class="bg-indigo-100 p-2 rounded-full">
          <BookOpenIcon class="w-5 h-5 text-indigo-600" />
        </div>

        <div>
          <p class="text-sm text-slate-700 font-medium">
            {{ getAsignaturaNombre(asignatura) }}
          </p>
          <p v-if="asignatura.codigo" class="text-xs text-slate-400">
            {{ asignatura.codigo }}
          </p>
        </div>
      </div>

      <button
        @click="selectAsignatura(asignatura)"
        class="px-3 py-1 text-sm bg-blue-500 text-white rounded-full"
      >
        Elegir
      </button>
    </div>

    <p v-if="asignaturasFiltradas.length === 0"
       class="text-xs text-slate-400 text-center py-3">
      No hay asignaturas disponibles
    </p>
  </div>

</div>

   <!-- STEP 5: ETAPA -->
<div v-show="step === 5">

  <h3 class="text-sm font-semibold text-slate-700 mb-4">
    Seleccionar Etapa
  </h3>

  <div class="flex justify-center gap-4">

    <button
      @click="selectEtapa(1)"
      class="px-5 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200"
    >
      Etapa 1
    </button>

    <button
      @click="selectEtapa(2)"
      class="px-5 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200"
    >
      Etapa 2
    </button>

    <button
      @click="selectEtapa(3)"
      class="px-5 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200"
    >
      Etapa 3
    </button>

  </div>

</div>

      <!-- CANCEL -->
      <div class="mt-6 flex items-center justify-between">

  <!-- ⬅️ ATRÁS -->
  <button
    @click="volverPaso"
    class="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition"
  >
    <ArrowLeftIcon class="w-5 h-5" />
    <span class="text-sm"></span>
  </button>

  <!-- ❌ CANCELAR -->
  <button
    @click="$emit('update:modelValue', false)"
    class="text-sm text-red-500 hover:text-red-600 transition"
  >
    Cancelar
  </button>

</div>

    </div>
  </div>
  <ConfirmModal
  :show="mostrarConfirmacion"
  :mensaje="`${profesorSeleccionado?.nombre} ya es PPA.\n¿Deseas asignarlo nuevamente?`"
  @aceptar="aceptarConfirmacion"
  @cancelar="cancelarConfirmacion"
/>
</template>

<script setup>
import { nextTick } from 'vue'
import { ref, computed, watch } from 'vue'
import { successAlert, errorAlert } from '../utiles/alerts'
import api from '../api/axios'
import { withScopeBody } from '../api/scope'
import { getCurrentUserAccess, getCurrentUserFacultyId, isCurrentUserDepartmentHead } from '../utiles/vicedecanos'
import {
  MagnifyingGlassIcon,
  UserIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  BookOpenIcon
} from '@heroicons/vue/24/outline'
const props = defineProps({
  modelValue: Boolean,
  estudiantes: Array
})

const emit = defineEmits(['update:modelValue', 'aa-creado'])

const step = ref(1)

const estudianteSeleccionado = ref(null)
const departamentoSeleccionado = ref(null)
const profesorSeleccionado = ref(null)
const asignaturaSeleccionada = ref(null)
const etapaSeleccionada = ref(null)

const departamentos = ref([])
const profesores = ref([])
const asignaturas = ref([])
const search = ref('')
const searchOpen = ref(false)
const searchInput = ref(null)
const estudiantesFiltrados = computed(() => {
  if (!search.value) return props.estudiantes

  return props.estudiantes.filter(e =>
    `${e.nombre} ${e.apellidos}`.toLowerCase()
      .includes(search.value.toLowerCase())
  )
})


// RESET
watch(() => props.modelValue, (val) => {
  if (val) {
    step.value = 1
    estudianteSeleccionado.value = null
    departamentoSeleccionado.value = null
    profesorSeleccionado.value = null
    asignaturaSeleccionada.value = null
    etapaSeleccionada.value = null
    asignaturas.value = []
    searchAsignatura.value = ''
  }
})
function selectEstudiante(est) {
  estudianteSeleccionado.value = est

  if (isCurrentUserDepartmentHead()) {
    cargarDepartamentoDelJefe()
  } else {
    cargarDepartamentos()
    step.value = 2
  }
}
async function cargarDepartamentos() {
  try {
    const facultyId = getCurrentUserFacultyId()

    if (!facultyId) {
      errorAlert('No hay una facultad asociada al usuario actual')
      return
    }

    const res = await api.get(`/facultad/${facultyId}/departamentos`)

    departamentos.value = res.data
  } catch (error) {
  console.error(error)
  errorAlert('No se pudieron cargar los departamentos')
}
}

async function cargarDepartamentoDelJefe() {
  const access = getCurrentUserAccess()
  const facultyId = getCurrentUserFacultyId()

  if (!access?.departmentId || !facultyId) {
    errorAlert('No hay un departamento asociado al jefe de departamento actual')
    return
  }

  const response = await api.get(`/facultad/${facultyId}/departamentos`)
  const departments = Array.isArray(response.data) ? response.data : response.data?.data ?? []
  const matchedDepartment = departments.find(dep => String(dep.id) === String(access.departmentId))

  await selectDepartamento({
    id: access.departmentId,
    nombre: matchedDepartment?.nombre ?? access.departmentName ?? 'Departamento actual',
  })
}

async function selectDepartamento(dep) {
  departamentoSeleccionado.value = dep

  const res = await api.get(`/miembro-departamento/activos/${dep.id}`)

  profesores.value = res.data.map(m => m.profesor)

  step.value = 3
}
function selectProfesor(prof) {
  profesorSeleccionado.value = prof
  cargarAsignaturas()
}

async function cargarAsignaturas() {
  try {
    const facultyId = getCurrentUserFacultyId()

    if (!facultyId) {
      errorAlert('No hay una facultad asociada al usuario actual')
      return
    }

    let data = []

    try {
      const res = await api.get(`/facultad/${facultyId}/asignaturas`)
      data = Array.isArray(res.data) ? res.data : res.data?.data ?? []
    } catch (error) {
      if (![404, 405].includes(error.response?.status)) throw error

      const res = await api.get('/asignaturas')
      const all = Array.isArray(res.data) ? res.data : res.data?.data ?? []
      data = all.filter(asignatura => {
        const asignaturaFacultyId = asignatura.facultad_id ?? asignatura.id_facultad ?? asignatura.facultyId
        return asignaturaFacultyId && String(asignaturaFacultyId) === String(facultyId)
      })
    }

    asignaturas.value = data
    step.value = 4
  } catch (error) {
    console.error('Error cargando asignaturas', error.response || error)
    errorAlert('No se pudieron cargar las asignaturas de la facultad')
  }
}

function selectAsignatura(asignatura) {
  asignaturaSeleccionada.value = asignatura
  step.value = 5
}
function selectEtapa(etapa) {
  etapaSeleccionada.value = etapa
  crearAA()
}
async function crearAA() {
  try {
    await api.post('/alumno-ayudante/designar', withScopeBody({
      id_estudiante: estudianteSeleccionado.value?.id,
      nombre_tutor: `${profesorSeleccionado.value?.nombre} ${profesorSeleccionado.value?.apellidos}`,
      id_asignatura: asignaturaSeleccionada.value?.id,
      asignatura: getAsignaturaNombre(asignaturaSeleccionada.value),
      etapa: String(etapaSeleccionada.value)
    }))
   successAlert(
  `Alumno ayudante asignado correctamente`
)
   

    emit('aa-creado')
    emit('update:modelValue', false)

  } catch (error) {
    console.error('ERROR BACKEND:', error.response || error)

    errorAlert(
  error.response?.data?.message || 'Error creando AA'
)
  }
}
function volverPaso() {
  if (step.value > 1) {
    step.value--
  }
}
const searchProf = ref('')
const searchOpenProf = ref(false)
const searchAsignatura = ref('')

const profesoresFiltrados = computed(() => {
  if (!searchProf.value) return profesores.value

  return profesores.value.filter(p =>
    `${p.nombre} ${p.apellidos}`.toLowerCase()
      .includes(searchProf.value.toLowerCase())
  )
})

function toggleSearchProf() {
  searchOpenProf.value = !searchOpenProf.value
}

function getAsignaturaNombre(asignatura = {}) {
  return asignatura.nombre ?? asignatura.asignatura ?? asignatura.nombre_asignatura ?? asignatura.descripcion ?? ''
}

const asignaturasFiltradas = computed(() => {
  if (!searchAsignatura.value) return asignaturas.value

  const busqueda = searchAsignatura.value.toLowerCase()

  return asignaturas.value.filter(asignatura =>
    `${getAsignaturaNombre(asignatura)} ${asignatura.codigo ?? ''}`
      .toLowerCase()
      .includes(busqueda)
  )
})

async function toggleSearch() {
  searchOpen.value = !searchOpen.value

  if (searchOpen.value) {
    await nextTick()
    searchInput.value?.focus()   // 🔥 AUTOFOCUS
  } else {
    search.value = ''
  }
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
