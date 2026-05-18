import api from '../api/axios'
import { getCurrentUserFacultyId } from './vicedecanos'

let cachedScope = null

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function resetFacultyScopeCache() {
  cachedScope = null
}

export async function getCurrentFacultyScope() {
  const facultyId = getCurrentUserFacultyId()
  if (!facultyId) return null

  if (cachedScope && String(cachedScope.facultyId) === String(facultyId)) {
    return cachedScope
  }

  const departamentosRes = await api.get(`/facultad/${facultyId}/departamentos`)
  const departamentos = Array.isArray(departamentosRes.data) ? departamentosRes.data : departamentosRes.data?.data ?? []
  const carreras = []

  for (const departamento of departamentos) {
    try {
      const carrerasRes = await api.get(`/departamento/${departamento.id}/carreras`)
      const data = Array.isArray(carrerasRes.data) ? carrerasRes.data : carrerasRes.data?.data ?? []
      carreras.push(...data)
    } catch (error) {
      console.error('Error cargando carreras de facultad', error)
    }
  }

  cachedScope = {
    facultyId,
    departamentos,
    carreras,
    departmentNames: new Set(departamentos.map(dep => normalizeText(dep.nombre))),
    careerNames: new Set(carreras.map(carrera => normalizeText(carrera.nombre))),
  }

  return cachedScope
}

export function itemBelongsToFaculty(item, scope) {
  if (!scope) return true

  const itemFacultyId = item?.id_facultad ?? item?.facultad_id ?? item?.facultyId
  if (itemFacultyId) return String(itemFacultyId) === String(scope.facultyId)

  const departamento = normalizeText(item?.departamento ?? item?.departamento_nombre)
  if (departamento && scope.departmentNames.has(departamento)) return true
  if (departamento) return false

  const carrera = normalizeText(item?.carrera ?? item?.programa ?? item?.programa_formacion)
  if (carrera && scope.careerNames.has(carrera)) return true
  if (carrera) return false

  const facultad = normalizeText(item?.facultad ?? item?.facultad_nombre)
  if (facultad) {
    return normalizeText(item?.facultad_id) === normalizeText(scope.facultyId)
  }

  return true
}

export async function filterByCurrentFaculty(items) {
  const scope = await getCurrentFacultyScope()
  if (!scope) return items

  return items.filter(item => itemBelongsToFaculty(item, scope))
}

async function getCurrentFacultyGroupIds() {
  const scope = await getCurrentFacultyScope()
  if (!scope) return new Set()

  const careerIds = new Set(scope.carreras.map(carrera => Number(carrera.id)))
  const anoGrupoRes = await api.get('/ano-grupo')
  const anoGrupo = Array.isArray(anoGrupoRes.data) ? anoGrupoRes.data : anoGrupoRes.data?.data ?? []

  return new Set(
    anoGrupo
      .filter(item => careerIds.has(Number(item.ano_academico?.id_prog_form ?? item.id_prog_form)))
      .map(item => Number(item.grupo_id ?? item.grupo?.id))
      .filter(Boolean)
  )
}

export async function getCurrentFacultyStudentIds() {
  const groupIds = await getCurrentFacultyGroupIds()
  if (groupIds.size === 0) return new Set()

  const estudianteGrupoRes = await api.get('/estudiante-grupo')
  const estudianteGrupo = Array.isArray(estudianteGrupoRes.data) ? estudianteGrupoRes.data : estudianteGrupoRes.data?.data ?? []

  return new Set(
    estudianteGrupo
      .filter(item => groupIds.has(Number(item.grupo_id ?? item.grupo?.id)))
      .map(item => Number(item.estudiante_id ?? item.estudiante?.id))
      .filter(Boolean)
  )
}

export async function filterStudentsByCurrentFaculty(students) {
  const studentIds = await getCurrentFacultyStudentIds()
  if (studentIds.size === 0) return []

  return students.filter(student => studentIds.has(Number(student.id ?? student.estudiante_id ?? student.estudiante?.id)))
}

export async function filterStudentItemsByCurrentFaculty(items) {
  const studentIds = await getCurrentFacultyStudentIds()
  if (studentIds.size === 0) return []

  return items.filter(item => {
    const studentId = item.estudiante_id ?? item.id_estudiante ?? item.estudiante?.id ?? item.alumno?.id
    return studentIds.has(Number(studentId))
  })
}

export function filterDocumentsByCurrentFaculty(documents) {
  const facultyId = getCurrentUserFacultyId()
  if (!facultyId) return documents

  return documents.filter(doc => {
    const documentFacultyId = doc?.facultad_id ?? doc?.id_facultad ?? doc?.facultyId
    return documentFacultyId && String(documentFacultyId) === String(facultyId)
  })
}

export async function getCurrentFacultyProfessors() {
  const scope = await getCurrentFacultyScope()
  if (!scope) return []

  const professorMap = new Map()

  for (const departamento of scope.departamentos) {
    try {
      const response = await api.get(`/miembro-departamento/activos/${departamento.id}`)
      const miembros = Array.isArray(response.data) ? response.data : response.data?.data ?? []

      miembros.forEach(miembro => {
        const profesor = miembro.profesor ?? miembro
        if (profesor?.id) professorMap.set(profesor.id, profesor)
      })
    } catch (error) {
      console.error('Error cargando profesores de facultad', error)
    }
  }

  return Array.from(professorMap.values())
}
