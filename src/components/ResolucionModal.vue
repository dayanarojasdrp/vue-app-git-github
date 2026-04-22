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

defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

async function exportar(tipo) {
      console.log('CLICK EN BOTÓN:', tipo)
  try {
    const url =
      tipo === 'pdf'
        ? '/api/export/resolucion/pdf'
        : '/api/export/resolucion/word'

    const res = await api.get(url, {
      responseType: 'blob',
      headers: {
        Accept: 'application/octet-stream'
      }
    })

    const blob = new Blob([res.data], {
      type: tipo === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    })

    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)

    link.download =
      tipo === 'pdf'
        ? 'resolucion.pdf'
        : 'resolucion.docx'

    document.body.appendChild(link)
    link.click()
    link.remove()

    emit('close')

  } catch (error) {
    console.error('ERROR EXPORTANDO:', error)
  }
}
</script>