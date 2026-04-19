<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">

    <h2 class="text-xl font-bold mb-4">Agregar Usuario</h2>

    <div class="space-y-4">

      <!-- Username -->
      <input
        v-model="username"
        placeholder="Nombre de usuario"
        class="w-full px-4 py-2 border rounded-xl"
      />

      <!-- Rol -->
      <select
        v-model="role"
        class="w-full px-4 py-2 border rounded-xl"
      >
        <option disabled value="">Selecciona un rol</option>
        <option value="admin">Admin</option>
        <option value="jefe de departamento">Jefe de departamento</option>
        <option value="invitado">Invitado</option>
      </select>

      <!-- Botón -->
      <button
        @click="crearUsuario"
        class="w-full bg-blue-500 text-white py-2 rounded-xl"
      >
        Crear usuario
      </button>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const role = ref('')

function crearUsuario() {

  if (!username.value || !role.value) {
    alert('Completa los campos')
    return
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []

  usuarios.push({
    username: username.value,
    password: '123', // default
    name: username.value,
    role: role.value
  })

  localStorage.setItem('usuarios', JSON.stringify(usuarios))

  alert('Usuario creado')

  username.value = ''
  role.value = ''
}
</script>