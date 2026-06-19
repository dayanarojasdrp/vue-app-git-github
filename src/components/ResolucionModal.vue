<template>
  <div v-show="show" 
 
  class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xl z-[9999]">

   <div 
      class="bg-white w-[380px] rounded-2xl shadow-2xl p-6 z-10"
      @click.stop
    >

      <h2 class="text-lg font-semibold text-slate-800 mb-4">
        Generar Resolución
      </h2>

      <p class="text-sm text-slate-500 mb-6">
        Selecciona el formato del documento
      </p>

      <div class="flex gap-3">

        <button
          @click="exportar('pdf')"
          class="flex-1 bg-red-500 text-white py-2 rounded-xl"
        >
          PDF
        </button>

        <button
          @click="exportar('word')"
          class="flex-1 bg-blue-500 text-white py-2 rounded-xl"
        >
          Word
        </button>

      </div>

      <button
        @click="$emit('close')"
        class="mt-4 w-full text-sm text-slate-400"
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
  assertResolutionSourceData,
  hasValidDocumentResponse,
  isNoDocumentInfoError,
  notifyNoDocumentInfo
} from '../utiles/documentos'



const emit = defineEmits(['close'])

async function exportar(formato) {
  try {
    if (!(await assertResolutionSourceData(props.tipo))) return

    let base = 'resolucion/ppa'

    if (props.tipo === 'aa') {
      base = 'resolucion/aa'
    }

    const url =
      formato === 'pdf'
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

    link.download =
      formato === 'pdf'
        ? `${props.tipo}_resolucion.pdf`
        : `${props.tipo}_resolucion.docx`

    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(fileURL)

    emit('close')
  } catch (error) {
    console.error('Error generando resolución', error.response || error)
    if (isNoDocumentInfoError(error)) {
      notifyNoDocumentInfo()
      return
    }

    notifyNoDocumentInfo()
  }
}
const props = defineProps({
  show: Boolean,
  tipo: {
    type: String,
    default: 'ppa'
  }
})
</script>
