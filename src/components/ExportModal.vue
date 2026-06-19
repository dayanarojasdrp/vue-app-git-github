<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xl z-[9999]">

    <div class="bg-white w-[380px] rounded-2xl shadow-2xl p-6">

      <h2 class="text-lg font-semibold text-slate-800 mb-4">
        Exportar información
      </h2>

      <p class="text-sm text-slate-500 mb-6">
        Selecciona el formato en el que deseas exportar los PPAs
      </p>

      <div class="flex gap-3">

        <!-- PDF -->
        <button
          @click="exportar('pdf')"
          class="flex-1 bg-red-500 text-white py-2 rounded-xl hover:scale-105 transition"
        >
          PDF
        </button>

        <!-- WORD -->
        <button
          @click="exportar('word')"
          class="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:scale-105 transition"
        >
          Word
        </button>

      </div>

      <button
        @click="$emit('close')"
        class="mt-4 w-full text-sm text-slate-400 hover:text-red-500"
      >
        Cancelar
      </button>

    </div>

  </div>
</template>

<script setup>
import api from '../api/axios'
import { withScopeParams } from '../api/scope'
import {
  hasValidDocumentResponse,
  isNoDocumentInfoError,
  notifyNoDocumentInfo
} from '../utiles/documentos'

const props = defineProps({
  show: Boolean,
  tipo: String // 🔥 NUEVO
})

const emit = defineEmits(['close'])

async function exportar(tipo) {
  try {
    const base = props.tipo === 'aa' ? 'aa' : 'ppa'

const url = tipo === 'pdf'
  ? `/export/${base}/pdf`
  : `/export/${base}/word`

    const res = await api.get(url, {
      responseType: 'blob',
      params: withScopeParams()
    })

    if (!(await hasValidDocumentResponse(res))) {
      notifyNoDocumentInfo()
      return
    }

    const blob = new Blob([res.data])
    const fileURL = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = fileURL
    link.download = tipo === 'pdf'
      ? `${base}.pdf`
      : `${base}.docx`
    link.click()
    window.URL.revokeObjectURL(fileURL)

    emit('close')

  } catch (error) {
    console.error('Error exportando', error)
    if (isNoDocumentInfoError(error)) {
      notifyNoDocumentInfo()
    }
  }
}
</script>
