<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const birthdays = ref([])
const loading = ref(true)

// Demo-Daten
const demoBirthdays = [
  {
    id: 1,
    first_name: 'Max',
    last_name: 'Mustermann',
    birthday: { date: '2005-12-06' },
    rolle: 'schüler',
  },
  {
    id: 2,
    first_name: 'Lisa',
    last_name: 'Müller',
    birthday: { date: '2006-05-20' },
    rolle: 'schüler',
  },
  {
    id: 3,
    first_name: 'Herr',
    last_name: 'Schmidt',
    birthday: { date: '1980-12-06' },
    rolle: 'lehrer',
  },
]

onMounted(() => {
  birthdays.value = demoBirthdays
  loading.value = false
})

// Helferfunktionen
const today = new Date().toISOString().split('T')[0]

const isToday = (date) => {
  return date === today
}

const calculateAge = (birthDate) => {
  const today = new Date()
  const birthDateObj = new Date(birthDate)
  let age = today.getFullYear() - birthDateObj.getFullYear()
  const monthDiff = today.getMonth() - birthDateObj.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--
  }
  return age
}

const goToProfile = (birthday) => {
  //window.location.href = `/user`
  router.push({ name: 'user' })
}

const getInitialsAvatar = (firstName, lastName) => {
  if (!firstName || !lastName) return ''
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
}
</script>

<template>
  <div
    class="sm:h-[100%] w-full bg-window_bg rounded-window shadow-window overflow-hidden flex flex-col"
  >
    <!-- Header -->
    <div class="px-4 pt-2 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <h2 class="text-primary_text text-base font-semibold">Geburtstage</h2>
      </div>
    </div>

    <!-- Birthday List -->
    <div class="flex-1 overflow-y-auto">
      <div class="space-y-1.5">
        <div v-if="loading" class="flex justify-center items-center h-32">
          <svg
            class="animate-spin h-6 w-6 text-second_accent"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>

        <div v-else-if="birthdays.length === 0" class="text-center text-secondary_text py-4">
          Keine Geburtstage in nächster Zeit.
        </div>

        <div
          v-else
          v-for="birthday in birthdays"
          :key="birthday.id"
          @click="goToProfile(birthday)"
          class="group relative flex items-center p-3 bg-window_bg hover:bg-[#d19cff45] transition-all cursor-pointer select-none"
        >
          <div class="flex-1 min-w-0 flex items-center space-x-3">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                :class="birthday.rolle === 'lehrer' ? 'bg-[#d19cff45]' : 'bg-[#a38cff2b]'"
              >
                <span
                  class="text-sm font-bold"
                  :class="birthday.rolle === 'lehrer' ? 'text-first_accent' : 'text-second_accent'"
                >
                  {{ getInitialsAvatar(birthday.first_name, birthday.last_name) }}
                </span>
              </div>
            </div>

            <!-- Name + Age -->
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-primary_text truncate">
                {{ birthday.first_name }} {{ birthday.last_name }}
              </p>
              <p class="text-xs text-secondary_text truncate">
                wird {{ calculateAge(birthday.birthday.date) + 1 }} Jahre alt
              </p>
            </div>

            <!-- Date -->
            <div class="flex-shrink-0 ml-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="
                  isToday(birthday.birthday.date)
                    ? 'bg-first_accent text-white'
                    : 'bg-gray-100 text-gray-800'
                "
              >
                {{
                  new Date(birthday.birthday.date).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                  })
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
