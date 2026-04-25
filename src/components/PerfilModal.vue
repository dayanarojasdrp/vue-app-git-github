<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xl z-[9999]">
    <div class="bg-white w-[420px] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

      <!-- HEADER -->
      <div class="flex items-center justify-between px-5 py-4 border-b">

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            {{ userInitial }}
          </div>

          <div>
            <p class="text-sm font-semibold text-slate-800">{{ user?.name }}</p>
            <p class="text-xs text-blue-500">{{ user?.role }}</p>
          </div>
        </div>

        <!-- ❌ cerrar -->
        <button @click="$emit('close')" class="text-slate-400 hover:text-red-500">
          ✕
        </button>

      </div>

      <!-- INFO -->
      <div class="px-5 py-4 border-b space-y-2 text-sm text-slate-600">
        <p><span class="font-medium">Usuario:</span> {{ user?.username }}</p>
        <p><span class="font-medium">Rol:</span> {{ user?.role }}</p>
      </div>

      <!-- HISTORIAL -->
      <div class="px-5 py-4">

        <p class="text-sm font-semibold text-slate-700 mb-3">
          Actividad reciente
        </p>

        <div class="max-h-[200px] overflow-y-auto space-y-2 pr-1 scroll-custom">

         <div
  v-for="(log, i) in logs"
  :key="i"
  class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
>
  <p class="text-xs text-slate-700">
    {{ log.descripcion }}
  </p>

  <p class="text-[10px] text-slate-400 mt-1">
    {{ formatearFecha(log.created_at) }}
  </p>
</div>

          <div v-if="logs.length === 0" class="text-xs text-slate-400 text-center">
            No hay actividad reciente
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import api from '../api/axios'
import { watch } from 'vue'
const props = defineProps({
  show: Boolean
})

const user = ref(null)
const logs = ref([])



watch(() => props.show, async (nuevoValor) => {
  if (nuevoValor) {
    user.value = JSON.parse(localStorage.getItem('user'))

    try {
      const res = await api.get('/logs', {
      params: {
  usuario: user.value?.username // 🔥 ESTE
}
      })

      logs.value = res.data
    } catch (error) {
      console.error('Error cargando logs', error)
    }
  }
})

const userInitial = computed(() => {
  return user.value?.name?.charAt(0).toUpperCase() || '?'
})
function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString()
}
</script>

<style>
.scroll-custom::-webkit-scrollbar {
  width: 6px;
}
.scroll-custom::-webkit-scrollbar-thumb {
  background: #cbd5f5;
  border-radius: 10px;
}
</style>