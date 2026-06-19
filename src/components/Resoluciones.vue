<template>
  <div class="h-full flex flex-col p-3">
    <section class="bg-white rounded-2xl border p-4 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-xl font-semibold text-slate-800">
            Resolución
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            Vista previa editable de la resolución
          </p>
        </div>

        <div class="flex gap-2">
          <button
            class="px-4 py-2 text-sm rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
            @click="exportar('pdf')"
          >
            PDF
          </button>

          <button
            class="px-4 py-2 text-sm rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition"
            @click="exportar('word')"
          >
            Word
          </button>
        </div>
      </div>

      <div class="flex items-center gap-5 mb-4 border-b border-slate-100">
        <button
          class="pb-2 text-xs font-medium transition border-b-2"
          :class="activeType === 'ppa'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'"
          @click="activeType = 'ppa'"
        >
          Resolución PPA
        </button>

        <button
          class="pb-2 text-xs font-medium transition border-b-2"
          :class="activeType === 'aa'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'"
          @click="activeType = 'aa'"
        >
          Resolución AA
        </button>
      </div>

      <p
        v-if="statusMessage"
        class="mb-3 text-xs"
        :class="statusType === 'error' ? 'text-red-500' : 'text-green-600'"
      >
        {{ statusMessage }}
      </p>

      <main
        class="rounded-xl bg-slate-100 border overflow-hidden flex-1 min-h-0"
      >
        <div
          v-if="loading"
          class="h-full flex items-center justify-center text-sm text-slate-400"
        >
          Cargando vista previa...
        </div>

        <div
          v-else-if="errorMessage"
          class="h-full flex items-center justify-center px-6 text-center text-sm text-red-500"
        >
          {{ errorMessage }}
        </div>

        <div
          v-else-if="htmlPreview"
          class="h-full bg-slate-200 p-3 overflow-hidden"
        >
          <div class="h-full w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner">
            <iframe
              ref="htmlFrameRef"
              :srcdoc="htmlPreview"
              :title="`Resolución ${activeType.toUpperCase()} editable`"
              class="w-full h-full border-0 bg-white block"
              @load="prepareEditableFrame"
            ></iframe>
          </div>
        </div>

        <iframe
          v-else-if="previewUrl"
          :src="viewerUrl"
          title="Vista previa de resolución"
          class="border-0 bg-white block"
          style="width: 100%; height: 100%; min-height: 760px;"
        ></iframe>
      </main>

      <input
        ref="logoInputRef"
        type="file"
        accept="image/png,image/jpeg"
        class="hidden"
        @change="handleLogoSelected"
      />
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import api from '../api/axios'
import { withScopeBody, withScopeParams } from '../api/scope'
import {
  assertResolutionSourceData,
  hasResolutionSourceData,
  hasValidDocumentResponse,
  isNoDocumentInfoError,
  NO_DOCUMENT_INFO_MESSAGE,
  notifyNoDocumentInfo
} from '../utiles/documentos'
import { getCurrentUserFacultyId } from '../utiles/vicedecanos'

const activeType = ref('ppa')
const previewUrl = ref('')
const htmlPreview = ref('')
const htmlFrameRef = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const statusMessage = ref('')
const statusType = ref('success')
const saveTimer = ref(null)
const logoInputRef = ref(null)
const selectedLogoField = ref('')

const editedFields = reactive({})
const facultyId = computed(() => getCurrentUserFacultyId())
const storageKey = computed(() => `resolucion:${activeType.value}:facultad:${facultyId.value ?? 'sin-facultad'}`)

const viewerUrl = computed(() => {
  if (!previewUrl.value) return ''

  return `${previewUrl.value}#toolbar=0&navpanes=0&scrollbar=1&zoom=85`
})

function revokePreviewUrl() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
}

function setEditedFields(fields = {}) {
  Object.keys(editedFields).forEach(key => {
    delete editedFields[key]
  })

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      editedFields[key] = String(value)
    }
  })
}

function getEditableFieldValues() {
  const doc = htmlFrameRef.value?.contentDocument
  if (!doc) return { ...editedFields }

  const values = { ...editedFields }

  doc
    .querySelectorAll('[data-field]')
    .forEach(element => {
      const key = element.dataset.field
      const isLogo = element.dataset.logoField || ['logo_izq', 'logo_der'].includes(key)

      if (!key || isLogo) return

      values[key] = element.textContent.trim()
    })

  return values
}

function syncEditedFields() {
  Object.assign(editedFields, getEditableFieldValues())
}

function onEditableInput() {
  syncEditedFields()
  statusMessage.value = 'Guardando cambios...'
  statusType.value = 'success'
  scheduleAutoSave()
}

function getPlainEditedFields() {
  return { ...editedFields }
}

function scheduleAutoSave() {
  if (saveTimer.value) {
    clearTimeout(saveTimer.value)
  }

  saveTimer.value = setTimeout(() => {
    saveResolutionSettings()
  }, 800)
}

function prepareEditableFrame() {
  const doc = htmlFrameRef.value?.contentDocument
  if (!doc) return

  const style = doc.createElement('style')
  style.textContent = `
    html,
    body {
      max-width: 100% !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
    }
    body {
      margin: 0 auto !important;
    }
    body > * {
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    [data-field] {
      border-bottom: 1px solid #2563eb;
      background: rgba(96, 165, 250, 0.12);
      border-radius: 3px;
      padding: 0 2px;
      outline: none;
      cursor: text;
    }
    [data-field]:focus {
      background: rgba(96, 165, 250, 0.24);
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.22);
    }
    [data-logo-field] {
      cursor: pointer;
      outline: 2px solid rgba(37, 99, 235, 0.25);
      outline-offset: 3px;
      border-radius: 4px;
    }
    [data-logo-field]:hover {
      outline-color: rgba(37, 99, 235, 0.7);
      filter: brightness(0.96);
    }
  `
  doc.head?.appendChild(style)

  const editableFields = doc.querySelectorAll('[data-field]')
  const logoFields = doc.querySelectorAll('[data-logo-field]')

  if (!editableFields.length && !logoFields.length) {
    statusType.value = 'error'
    statusMessage.value = 'La plantilla no trae campos editables. Revisa data-field y data-logo-field en el backend.'
    return
  }

  editableFields.forEach(element => {
    element.setAttribute('contenteditable', 'true')
    element.addEventListener('input', onEditableInput)
  })

  logoFields.forEach(element => {
    element.setAttribute('title', 'Cambiar logo')
    element.addEventListener('click', () => {
      openLogoPicker(element.dataset.logoField || element.dataset.field)
    })
  })

  syncEditedFields()
}

function openLogoPicker(field) {
  if (!field) return

  selectedLogoField.value = field
  if (logoInputRef.value) {
    logoInputRef.value.value = ''
    logoInputRef.value.click()
  }
}

async function handleLogoSelected(event) {
  const file = event.target.files?.[0]
  const field = selectedLogoField.value

  if (!file || !field) return

  try {
    statusMessage.value = 'Subiendo logo...'
    statusType.value = 'success'

    const formData = new FormData()
    formData.append('file', file)
    formData.append('logo', file)
    formData.append(field, file)
    formData.append('field', field)

    const response = await api.post(`/resoluciones/${activeType.value}/configuracion/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    const fields = response.data?.fields ?? {}

    Object.assign(editedFields, fields)
    saveLocalSettings({ ...editedFields })

    statusMessage.value = 'Logo guardado para esta facultad'
    statusType.value = 'success'

    await loadHtmlPreview()
  } catch (error) {
    console.error('Error subiendo logo', error.response || error)
    statusMessage.value = error.response?.data?.message || 'No se pudo subir el logo'
    statusType.value = 'error'
  } finally {
    selectedLogoField.value = ''
  }
}

function loadLocalSettings() {
  try {
    const stored = localStorage.getItem(storageKey.value)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function saveLocalSettings(fields) {
  localStorage.setItem(storageKey.value, JSON.stringify(fields))
}

async function loadResolutionSettings() {
  try {
    const response = await api.get(`/resoluciones/${activeType.value}/configuracion`, {
      params: withScopeParams()
    })
    const fields = response.data?.fields ?? response.data?.data ?? response.data ?? {}

    setEditedFields(fields)
    saveLocalSettings(fields)
    return
  } catch (error) {
    if (![404, 405].includes(error.response?.status)) {
      console.warn('No se pudo cargar configuración de resolución desde backend', error.response || error)
    }
  }

  const localFields = loadLocalSettings()
  if (localFields) setEditedFields(localFields)
}

async function saveResolutionSettings() {
  try {
    const fields = getEditableFieldValues()
    setEditedFields(fields)
    saveLocalSettings(fields)

    await api.put(`/resoluciones/${activeType.value}/configuracion`, withScopeBody({
      tipo: activeType.value,
      fields
    }))

    statusType.value = 'success'
    statusMessage.value = 'Cambios guardados para esta facultad'
  } catch (error) {
    if ([404, 405].includes(error.response?.status)) {
      statusType.value = 'success'
      statusMessage.value = 'Cambios guardados localmente para esta facultad'
      return
    }

    console.error('Error guardando configuración de resolución', error.response || error)
    statusType.value = 'error'
    statusMessage.value = error.response?.data?.message || 'No se pudieron guardar los cambios'
  }
}

async function loadHtmlPreview() {
  loading.value = true
  errorMessage.value = ''
  htmlPreview.value = ''
  revokePreviewUrl()

  try {
    if (!(await hasResolutionSourceData(activeType.value))) {
      errorMessage.value = NO_DOCUMENT_INFO_MESSAGE
      return
    }

    await loadResolutionSettings()

    const response = await api.get(`/export/resolucion/${activeType.value}/html`, {
      responseType: 'text',
      params: withScopeParams(getPlainEditedFields())
    })

    htmlPreview.value = response.data

    await nextTick()
  } catch (error) {
    console.error(`Error cargando HTML de resolución ${activeType.value.toUpperCase()}`, error.response || error)
    errorMessage.value = error.response?.data?.message || 'No se pudo cargar la vista editable de la resolución.'
  } finally {
    loading.value = false
  }
}

async function loadPreview() {
  await loadHtmlPreview()
}

async function exportar(format) {
  try {
    if (!(await assertResolutionSourceData(activeType.value))) {
      errorMessage.value = NO_DOCUMENT_INFO_MESSAGE
      return
    }

    syncEditedFields()
    await saveResolutionSettings()

    const base = activeType.value === 'aa'
      ? 'resolucion/aa'
      : 'resolucion/ppa'
    const extension = format === 'word' ? 'word' : 'pdf'
    const response = await api.get(`/export/${base}/${extension}`, {
      responseType: 'blob',
      params: withScopeParams(getPlainEditedFields())
    })

    if (!(await hasValidDocumentResponse(response))) {
      errorMessage.value = NO_DOCUMENT_INFO_MESSAGE
      notifyNoDocumentInfo()
      return
    }

    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `${activeType.value}_resolucion.${extension === 'word' ? 'docx' : 'pdf'}`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exportando resolución', error.response || error)
    if (isNoDocumentInfoError(error)) {
      errorMessage.value = NO_DOCUMENT_INFO_MESSAGE
      notifyNoDocumentInfo()
      return
    }

    errorMessage.value = error.response?.data?.message || 'No se pudo exportar la resolución.'
  }
}

watch(activeType, () => {
  if (saveTimer.value) {
    clearTimeout(saveTimer.value)
    saveTimer.value = null
  }

  statusMessage.value = ''
  statusType.value = 'success'
  loadPreview()
})

onMounted(() => {
  loadPreview()
})

onBeforeUnmount(() => {
  if (saveTimer.value) {
    clearTimeout(saveTimer.value)
  }
  revokePreviewUrl()
})
</script>
