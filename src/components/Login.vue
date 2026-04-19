<template>
  <div class="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
  <div class="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-10"></div>
 <div class="absolute w-72 h-72 bg-purple-300/20 rounded-full blur-3xl bottom-10 right-10"></div>
    <!-- Card -->
    <div class="w-[320px] p-6 rounded-3xl backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl">

      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-slate-800 mb-2">
        Bienvenido
      </h2>
      <p class="text-sm text-slate-400 text-center mb-6">
        Inicia sesión para continuar
      </p>

      <!-- Form -->
      <form @submit.prevent="login" class="space-y-4">

        <!-- Usuario -->
        <div>
          <label class="text-sm text-slate-600">Usuario</label>
          <input
            v-model="username"
            type="text"
            class="w-full mt-1 px-4 py-2 rounded-xl bg-white/80 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none transition shadow-sm"
            placeholder="Ingresa tu usuario"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="text-sm text-slate-600">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="w-full mt-1 px-4 py-2 rounded-xl bg-white/80 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none transition shadow-sm"
            placeholder="••••••••"
          />
        </div>

        <!-- Botón -->
        <button
          class="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-xl font-semibold transition shadow-lg hover:scale-[1.02]"
        >
          Iniciar sesión
        </button>

      </form>

      <!-- Footer -->
      <p class="text-xs text-center text-slate-400 mt-6">
        Sistema de Gestión de Roles
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')

function login() {
  // Simulación (luego conectas con backend real)
  if (username.value && password.value) {
    const user = {
      name: username.value,
      role: 'admin'
    }

    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('loginTime', Date.now())

    location.reload()
  } else {
    alert('Completa los campos')
  }
}
</script>