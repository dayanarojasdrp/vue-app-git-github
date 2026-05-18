<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow space-y-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Usuarios</h2>
        <p class="text-sm text-slate-500">Usuarios disponibles en la API externa.</p>
      </div>

      <button
        @click="loadUsers"
        :disabled="loading"
        class="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition disabled:opacity-60"
      >
        {{ loading ? 'Cargando...' : 'Recargar' }}
      </button>
    </div>

    <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
      {{ error }}
    </p>

    <div class="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
      <div
        v-for="user in usuarios"
        :key="user.username"
        class="px-4 py-3"
      >
        <p class="font-medium text-slate-800">{{ user.username }}</p>
        <p class="text-sm text-slate-500">{{ user.name }} · {{ user.role }}</p>
      </div>

      <p v-if="!loading && usuarios.length === 0" class="text-sm text-slate-500 text-center py-6">
        No hay usuarios disponibles.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getUsers } from '../api/users'

const usuarios = ref([])
const loading = ref(false)
const error = ref('')

onMounted(loadUsers)

async function loadUsers() {
  loading.value = true
  error.value = ''

  try {
    usuarios.value = await getUsers()
  } catch (err) {
    usuarios.value = []
    error.value = 'No se pudo cargar la API de usuarios'
  } finally {
    loading.value = false
  }
}
</script>
