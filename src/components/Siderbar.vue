<template>
  <aside class="w-64 h-screen bg-white border-r flex flex-col">
    
    <div class="px-6 py-6 border-b">
      <h1 class="text-lg font-bold">
        Gestión de Roles
      </h1>
    </div>

   
    <nav class="flex-1 px-4 py-6 space-y-2">
     <button
  class="link"
  :class="{ active: active === 'panel' }"
  @click="$emit('change', 'panel')"
>
  Panel
</button>


      <button
  class="link"
  :class="{ active: active === 'profesores' }"
  @click="$emit('change', 'profesores')"
>
  Profesores
</button>



      <button
  class="link"
  :class="{ active: active === 'estudiantes' }"
  @click="$emit('change', 'estudiantes')"
>
  Estudiantes
</button>


    <button
  class="link"
  :class="{ active: active === 'documentos' }"
  @click="$emit('change', 'documentos')"
>
  Documentos
</button>

    </nav>
  </aside>
</template>

<style scoped>

.link {
  width: 100%;
  text-align: left;
  padding: 14px 18px;
  border-radius: 14px;

  font-size: 15px;
  font-weight: 500;
  color: #334155;

  display: flex;
  align-items: center;

  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.15s ease;
}


.link:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}


.active {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
}


.active:hover {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
}

</style>
<script setup>
  defineProps({
  active: String
})

</script>