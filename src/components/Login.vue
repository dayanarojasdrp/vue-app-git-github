<template>
  <div class="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200">
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
<div 
  v-if="message"
  class="mb-4 px-4 py-3 rounded-xl text-sm font-medium border animate-fade"
  :class="{
    'bg-red-100 text-red-700 border-red-200': messageType === 'error',
    'bg-yellow-100 text-yellow-700 border-yellow-200': messageType === 'warning'
  }"
>
  {{ message }}
</div>
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
const message = ref('')
const messageType = ref('') // error | warning

// 🔥 usuarios TEMPORALES (frontend)
const usuarios = [
  {
    username: 'dayarojas',
    password: '123',
    name: 'Dayana Rojas',
    role: 'admin'
  },
  {
    username: 'raul',
    password: '123',
    name: 'Raul',
    role: 'jefededepartamento'
  },
  {
    username: 'invitado',
    password: '123',
    name: 'Invitado',
    role: 'invitado'
  }
]

function login() {

  // ❌ Ambos vacíos
  if (!username.value && !password.value) {
    message.value = 'Debes ingresar usuario y contraseña'
    messageType.value = 'error'
    return
  }

  // ⚠️ Uno vacío
  if (!username.value || !password.value) {
    message.value = 'Completa todos los campos'
    messageType.value = 'warning'
    return
  }

  // 🔍 Buscar usuario
  const userFound = usuarios.find(
    u => u.username === username.value && u.password === password.value
  )

  // ❌ No existe
  if (!userFound) {
    message.value = 'Usuario o contraseña incorrectos'
    messageType.value = 'error'
    return
  }

  // ✅ Login correcto (IMPORTANTE: username incluido)
  localStorage.setItem('user', JSON.stringify({
    name: userFound.name,
    username: userFound.username, // 🔥 CLAVE
    role: userFound.role
  }))

  localStorage.setItem('loginTime', Date.now())

  location.reload()
}
</script>
<style scoped>
@keyframes fade {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade {
  animation: fade 0.25s ease;
}
</style>