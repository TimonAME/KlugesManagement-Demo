<script setup>
import { ref, onMounted } from 'vue'

const subjects = ref([
  { id: 1, name: 'Mathematik', color_hex_code: '#F87171' },
  { id: 2, name: 'Deutsch', color_hex_code: '#34D399' },
  { id: 3, name: 'Englisch', color_hex_code: '#60A5FA' },
])

const userSubjects = ref([{ id: 1, name: 'Mathematik', color_hex_code: '#F87171' }])

const loading = ref(true)
const showForm = ref(false)
const newSubject = ref({ name: '', color_hex_code: '#6B7280' })

onMounted(() => {
  // Fake loading
  setTimeout(() => (loading.value = false), 500)
})

const isUserSubject = (subjectId) => userSubjects.value.some((s) => s.id === subjectId)

const getAvailableSubjects = () => subjects.value.filter((s) => !isUserSubject(s.id))

const getLighterColor = (hexColor) => `${hexColor}15`

const toggleSubject = (subjectId) => {
  const index = userSubjects.value.findIndex((s) => s.id === subjectId)
  if (index !== -1) {
    // Entfernen
    userSubjects.value.splice(index, 1)
  } else {
    // Hinzufügen
    const subject = subjects.value.find((s) => s.id === subjectId)
    if (subject) userSubjects.value.push(subject)
  }
}

const handleAddSubject = () => {
  if (!newSubject.value.name) return
  const id = subjects.value.length + 1
  const subject = { id, ...newSubject.value }
  subjects.value.push(subject)
  userSubjects.value.push(subject)
  newSubject.value = { name: '', color_hex_code: '#6B7280' }
  showForm.value = false
}
</script>

<template>
  <div class="h-full p-2">
    <h2 class="text-primary_text text-lg font-semibold mb-1 select-none px-2">Meine Fächer</h2>

    <div class="flex-grow w-full overflow-y-auto select-none p-2 pb-10">
      <div v-if="loading" class="text-center py-4">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-second_accent mx-auto"
        ></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="subject in userSubjects"
          :key="subject.id"
          class="group relative flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-xl cursor-pointer"
          :style="{
            backgroundColor: getLighterColor(subject.color_hex_code),
            color: subject.color_hex_code,
          }"
          @click="toggleSubject(subject.id)"
        >
          <span class="text-sm font-semibold">{{ subject.name }}</span>
        </div>

        <div
          v-for="subject in getAvailableSubjects()"
          :key="subject.id"
          class="group relative flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-xl cursor-pointer opacity-30"
          :style="{
            backgroundColor: getLighterColor(subject.color_hex_code),
            color: subject.color_hex_code,
          }"
          @click="toggleSubject(subject.id)"
        >
          <span class="text-sm font-semibold">{{ subject.name }}</span>
        </div>

        <button
          v-if="!showForm"
          @click="showForm = true"
          class="group flex items-center justify-center p-3 rounded-lg shadow-sm hover:shadow-xl bg-gray-100 border-2 border-dashed border-gray-300"
        >
          <span class="text-gray-500 text-sm font-medium ml-2">Neues Fach erstellen</span>
        </button>
      </div>

      <form v-if="showForm" @submit.prevent="handleAddSubject" class="mt-8 pb-10">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="newSubject.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Farbe</label>
            <input
              v-model="newSubject.color_hex_code"
              type="color"
              class="w-full h-10 px-1 py-1 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>

          <div class="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              @click="showForm = false"
              class="mt-2 px-6 py-3 w-full rounded-window border-icon_color border font-semibold text-primary_text bg-window_bg opacity-80 hover:opacity-100"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              class="mt-2 px-6 py-3 w-full rounded-window font-semibold text-white bg-main opacity-80 hover:opacity-100"
              :disabled="!newSubject.name"
            >
              Hinzufügen
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
