<template>
  <div class="sticky top-0 z-50 bg-blue-50 border-b border-blue-100 px-6 py-4 flex justify-between items-center shadow-sm">

    <!-- IZQUIERDA -->
    <div>
      <h1 class="text-xl font-semibold text-slate-800">
        {{ title }}
      </h1>

      <!-- SLOT (para tabs tipo PPA / AA si quieres) -->
      <div v-if="$slots.extra" class="mt-2">
        <slot name="extra"></slot>
      </div>
    </div>

    <!-- DERECHA -->
    <div class="flex items-center gap-3">

      <!-- SLOT para botones -->
      <slot name="actions"></slot>

      <!-- BOTÓN EXPORTAR DEFAULT -->
      <button
        class="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-md hover:scale-[1.03] transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg"
             class="w-5 h-5"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0l-3 3m3-3l3 3"/>
        </svg>

        Exportar
      </button>

    </div>

  </div>
</template>

<script setup>
defineProps({
  title: String
})
</script>