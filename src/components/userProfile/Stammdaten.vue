<script setup>
import { ref, onMounted } from 'vue'

// Demo User Data
const userData = ref({
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max.mustermann@example.com',
  birthday: '1990-01-01',
  learningLevel: '10. Klasse',
  privateLocation: {
    street: 'Musterstraße',
    houseNumber: '12A',
    postalCode: '12345',
    city: 'Musterstadt',
  },
})

const loading = ref(true)
const error = ref(null)
const successMessage = ref('')

// Fake fetching user data
onMounted(() => {
  loading.value = true
  setTimeout(() => {
    // Daten sind bereits in userData, nur Ladezeit simulieren
    loading.value = false
    error.value = null
  }, 500) // 0.5s Ladezeit
})

// Fake update function
const updateUserData = async () => {
  loading.value = true
  error.value = null
  successMessage.value = ''

  try {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Fake Netzwerk-Latenz
    successMessage.value = 'Daten erfolgreich aktualisiert'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = 'Fehler beim Aktualisieren der Daten'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="updateUserData" class="h-full p-4 overflow-y-auto overflow-x-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-second_accent mx-auto"
      ></div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
    >
      {{ successMessage }}
    </div>

    <div v-if="!loading" class="grid md:grid-cols-2 gap-6 w-full">
      <!-- Personal Information Section -->
      <div class="space-y-4 mb-4">
        <h2 class="text-lg font-semibold text-primary_text mb-4">Persönliche Informationen</h2>
        <div class="form-group">
          <label for="firstName" class="block text-sm font-medium text-primary_text mb-1"
            >Vorname<span class="text-xl text-red-500">*</span></label
          >
          <input
            v-model="userData.firstName"
            type="text"
            id="firstName"
            required
            class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second_accent focus:border-second_accent"
          />
        </div>
        <div class="form-group">
          <label for="lastName" class="block text-sm font-medium text-primary_text mb-1"
            >Nachname<span class="text-xl text-red-500">*</span></label
          >
          <input
            v-model="userData.lastName"
            type="text"
            id="lastName"
            required
            class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second_accent focus:border-second_accent"
          />
        </div>
        <div class="form-group">
          <label for="birthday" class="block text-sm font-medium text-primary_text mb-1"
            >Geburtsdatum<span class="text-xl text-red-500">*</span></label
          >
          <input
            v-model="userData.birthday"
            type="date"
            id="birthday"
            required
            class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second_accent focus:border-second_accent"
          />
        </div>
      </div>

      <!-- Contact Information Section -->
      <div class="space-y-4 mb-4">
        <h2 class="text-lg font-semibold text-primary_text mb-4">Kontaktinformationen</h2>
        <div class="form-group">
          <label for="email" class="block text-sm font-medium text-primary_text mb-1"
            >Email<span class="text-xl text-red-500">*</span></label
          >
          <input
            v-model="userData.email"
            type="email"
            id="email"
            required
            class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second_accent focus:border-second_accent"
          />
        </div>
        <div class="space-y-3">
          <label class="block text-sm font-medium text-primary_text mb-1"
            >Adresse<span class="text-xl text-red-500">*</span></label
          >
          <div class="grid grid-cols-3 gap-2">
            <input
              v-model="userData.privateLocation.street"
              type="text"
              placeholder="Straße"
              class="col-span-2 block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second_accent focus:border-second_accent"
              required
            />
            <input
              v-model="userData.privateLocation.houseNumber"
              type="text"
              placeholder="Nr."
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second_accent focus:border-second_accent"
              required
            />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model="userData.privateLocation.postalCode"
              type="text"
              placeholder="PLZ"
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second_accent focus:border-second_accent"
              required
            />
            <input
              v-model="userData.privateLocation.city"
              type="text"
              placeholder="Stadt"
              class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second_accent focus:border-second_accent"
              required
            />
          </div>
        </div>
      </div>

      <!-- Learning Information Section -->
      <div class="space-y-4 mb-4">
        <h2 class="text-lg font-semibold text-primary_text mb-4">Lern Informationen</h2>
        <div class="form-group">
          <label for="learningLevel" class="block text-sm font-medium text-primary_text mb-1"
            >Klasse/Lernstufe</label
          >
          <input
            v-model="userData.learningLevel"
            type="text"
            id="learningLevel"
            class="block w-full p-2 border border-gray-300 rounded-window shadow-sm focus:ring-second_accent focus:border-second_accent"
          />
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-6 w-full">
      <div class="text-secondary_text mb-4">
        Felder mit einem <span class="text-xl text-red-500">*</span> müssen ausgefüllt sein
      </div>
      <button
        type="submit"
        class="w-full px-6 py-3 rounded-window font-semibold text-white bg-second_accent transition-all duration-200 hover:bg-opacity-90 disabled:opacity-50"
        :disabled="loading"
      >
        {{ loading ? 'Wird aktualisiert...' : 'Aktualisieren' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.form-group {
  position: relative;
}

input:focus {
  outline: none;
}
</style>
