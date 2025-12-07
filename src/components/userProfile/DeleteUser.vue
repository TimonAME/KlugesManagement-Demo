<script setup>
import { ref } from 'vue'

const isDeleting = ref(false)
const error = ref(null)
const success = ref(false)

const handleDelete = async () => {
  isDeleting.value = true
  error.value = null

  try {
    // Demo: Simuliere erfolgreiche Löschung nach 1,5 Sekunden
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Erfolgreich
    success.value = true
  } catch (err) {
    error.value = 'Fehler beim Löschen des Accounts'
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center p-6">
    <h1 class="text-2xl font-bold text-error_text mb-4">Account Löschen Beantragen</h1>
    <p class="text-lg text-error_text mb-2 text-center">
      Sind Sie sicher, dass dieser Account gelöscht werden soll? Diese Aktion kann nicht rückgängig
      gemacht werden!
    </p>
    <p class="text-lg text-error_text mb-6 text-center">
      Alle personenbezogenen Daten werden mit dieser Aktion gelöscht.
    </p>

    <div v-if="error" class="bg-red-100 text-red-800 p-3 rounded mb-4">
      {{ error }}
    </div>

    <button
      class="bg-error-text text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
      @click="handleDelete"
      :disabled="isDeleting"
    >
      {{ isDeleting ? 'Löschen...' : 'Löschen' }}
    </button>

    <div v-if="success" class="bg-green-100 text-green-800 p-3 rounded mt-4">
      Löschantrag erfolgreich gesendet.
    </div>
  </div>
</template>
