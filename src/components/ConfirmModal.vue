<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">

    <div class="bg-white w-[350px] rounded-2xl p-5 shadow-2xl border border-slate-200">

      <!-- HEADER -->
      <div class="flex items-center gap-3 mb-3">
        <div class="bg-yellow-100 p-2 rounded-xl">
          ⚠️
        </div>

        <h2 class="text-sm font-semibold text-slate-700">
          Confirmación
        </h2>
      </div>

      <!-- MENSAJE -->
      <p class="text-sm text-slate-600 mb-5 whitespace-pre-line">
        {{ mensaje }}
      </p>

      <!-- BOTONES -->
      <div class="flex justify-end gap-2">
        <button
          @click="$emit('cancelar')"
          class="px-3 py-1.5 text-sm rounded-full bg-slate-100 hover:bg-slate-200"
        >
          Cancelar
        </button>

        <button
          @click="$emit('aceptar')"
          class="px-3 py-1.5 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          Continuar
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  mensaje: String
})
</script>