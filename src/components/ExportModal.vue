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

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

async function exportar(tipo) {
  try {
    const url = tipo === 'pdf'
      ? '/export/ppa/pdf'
      : '/export/ppa/word'

    const res = await api.get(url, {
      responseType: 'blob'
    })

    const blob = new Blob([res.data])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = tipo === 'pdf' ? 'ppa.pdf' : 'ppa.docx'
    link.click()

    emit('close')

  } catch (error) {
    console.error('Error exportando', error)
  }
}
</script>