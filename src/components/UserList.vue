<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Demo-Daten
const demoUsers = [
  {
    id: 1,
    first_name: 'Max',
    last_name: 'Mustermann',
    email: 'max@example.com',
    telefon: '+43 660 1234567',
    roles: '["ROLE_TEACHER"]',
    subject_names: 'Mathematik,Physik',
    subject_colors: '#FF6B6B,#4ECDC4',
  },
  {
    id: 2,
    first_name: 'Anna',
    last_name: 'Müller',
    email: 'anna@example.com',
    telefon: '+43 660 2345678',
    roles: '["ROLE_STUDENT"]',
    subject_names: null,
    subject_colors: null,
  },
  {
    id: 3,
    first_name: 'Tom',
    last_name: 'Meier',
    email: 'tom@example.com',
    telefon: null,
    roles: '["ROLE_TEACHER"]',
    subject_names: 'Deutsch,Englisch,Geschichte',
    subject_colors: '#95E1D3,#F38181,#AA96DA',
  },
  {
    id: 4,
    first_name: 'Lisa',
    last_name: 'Schmidt',
    email: 'lisa@example.com',
    telefon: '+43 660 4567890',
    roles: '["ROLE_MANAGEMENT"]',
    subject_names: null,
    subject_colors: null,
  },
  {
    id: 5,
    first_name: 'Jonas',
    last_name: 'Klein',
    email: 'jonas@example.com',
    telefon: '+43 660 5678901',
    roles: '["ROLE_STUDENT"]',
    subject_names: null,
    subject_colors: null,
  },
  {
    id: 6,
    first_name: 'Sarah',
    last_name: 'Weber',
    email: 'sarah@example.com',
    telefon: '+43 660 6789012',
    roles: '["ROLE_TEACHER"]',
    subject_names: 'Biologie,Chemie',
    subject_colors: '#96CEB4,#FFEAA7',
  },
  {
    id: 7,
    first_name: 'Michael',
    last_name: 'Wagner',
    email: 'michael@example.com',
    telefon: null,
    roles: '["ROLE_OFFICE"]',
    subject_names: null,
    subject_colors: null,
  },
  {
    id: 8,
    first_name: 'Julia',
    last_name: 'Becker',
    email: 'julia@example.com',
    telefon: '+43 660 8901234',
    roles: '["ROLE_STUDENT"]',
    subject_names: null,
    subject_colors: null,
  },
  {
    id: 9,
    first_name: 'David',
    last_name: 'Schulz',
    email: 'david@example.com',
    telefon: '+43 660 9012345',
    roles: '["ROLE_LOCATION_MANAGEMENT"]',
    subject_names: null,
    subject_colors: null,
  },
  {
    id: 10,
    first_name: 'Emma',
    last_name: 'Fischer',
    email: 'emma@example.com',
    telefon: '+43 660 0123456',
    roles: '["ROLE_TEACHER"]',
    subject_names: 'Kunst,Musik',
    subject_colors: '#DDA15E,#BC6C25',
  },
  {
    id: 11,
    first_name: 'Paul',
    last_name: 'Hoffmann',
    email: 'paul@example.com',
    telefon: '+43 660 1122334',
    roles: '["ROLE_STUDENT"]',
    subject_names: null,
    subject_colors: null,
  },
  {
    id: 12,
    first_name: 'Sophie',
    last_name: 'Richter',
    email: 'sophie@example.com',
    telefon: null,
    roles: '["ROLE_MARKETING"]',
    subject_names: null,
    subject_colors: null,
  },
  {
    id: 13,
    first_name: 'Felix',
    last_name: 'Koch',
    email: 'felix@example.com',
    telefon: '+43 660 2233445',
    roles: '["ROLE_STUDENT"]',
    subject_names: null,
    subject_colors: null,
  },
  {
    id: 14,
    first_name: 'Laura',
    last_name: 'Bauer',
    email: 'laura@example.com',
    telefon: '+43 660 3344556',
    roles: '["ROLE_TEACHER"]',
    subject_names: 'Sport,Geografie',
    subject_colors: '#06D6A0,#118AB2',
  },
  {
    id: 15,
    first_name: 'Lukas',
    last_name: 'Wolf',
    email: 'lukas@example.com',
    telefon: '+43 660 4455667',
    roles: '["ROLE_STUDENT"]',
    subject_names: null,
    subject_colors: null,
  },
]

// State
const users = ref([...demoUsers])
const allUsers = ref([...demoUsers])
const filter = ref('')
const searchQuery = ref('')
const loading = ref(false)
const totalUsers = ref(demoUsers.length)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

// Role configurations
const ROLE_CONFIG = {
  views: {
    1: ['ROLE_MANAGEMENT', 'ROLE_LOCATION_MANAGEMENT', 'ROLE_OFFICE'],
    2: ['ROLE_MARKETING'],
    3: ['ROLE_TEACHER'],
  },
  mapping: {
    ROLE_MANAGEMENT: { name: 'Management', color: 'rgba(255,136,107,0.15)' },
    ROLE_LOCATION_MANAGEMENT: { name: 'Standortleitung', color: 'rgba(255,169,107,0.15)' },
    ROLE_OFFICE: { name: 'Büro', color: 'rgba(255,213,107,0.15)' },
    ROLE_TEACHER: { name: 'Lehrer', color: 'rgba(150,205,83,0.15)' },
    ROLE_STUDENT: { name: 'Schüler', color: 'rgba(76,241,128,0.15)' },
    ROLE_GUARDIAN: { name: 'Erziehungsberechtigte', color: 'rgba(82,205,227,0.15)' },
    ROLE_MARKETING: { name: 'Marketing', color: 'rgba(107,149,255,0.15)' },
  },
  additionalRoles: [
    { key: 'ROLE_MANAGEMENT', name: 'Management', color: 'rgba(255,136,107,0.15)' },
    { key: 'ROLE_LOCATION_MANAGEMENT', name: 'Standortleitung', color: 'rgba(255,169,107,0.15)' },
    { key: 'ROLE_OFFICE', name: 'Büro', color: 'rgba(255,213,107,0.15)' },
    { key: 'ROLE_MARKETING', name: 'Marketing', color: 'rgba(107,149,255,0.15)' },
  ],
}

// Für Demo: Simuliere dass wir Management-Rolle haben
const currentRole = ref('ROLE_MANAGEMENT')

// Computed properties
const activeView = computed(() =>
  Object.keys(ROLE_CONFIG.views).find((key) => ROLE_CONFIG.views[key].includes(currentRole.value)),
)

const selectedRole = computed(() =>
  filter.value
    ? ROLE_CONFIG.additionalRoles.find((role) =>
        role.key.toLowerCase().includes(filter.value.toLowerCase()),
      )
    : null,
)

// Filter und Search Logic
const filterAndSearchUsers = () => {
  let filtered = [...allUsers.value]

  // Filter nach Rolle
  if (filter.value) {
    const filterRole =
      filter.value === 'teacher'
        ? 'ROLE_TEACHER'
        : filter.value === 'student'
          ? 'ROLE_STUDENT'
          : filter.value === 'management'
            ? 'ROLE_MANAGEMENT'
            : filter.value === 'location_management'
              ? 'ROLE_LOCATION_MANAGEMENT'
              : filter.value === 'office'
                ? 'ROLE_OFFICE'
                : filter.value === 'marketing'
                  ? 'ROLE_MARKETING'
                  : ''

    if (filterRole) {
      filtered = filtered.filter((user) => user.roles.includes(filterRole))
    }
  }

  // Search Query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (user) =>
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.telefon && user.telefon.includes(query)),
    )
  }

  users.value = filtered
  totalUsers.value = filtered.length
}

// URL management
const goToUrl = (location) => {
  const mapping = {
    '': '',
    schueler: 'student',
    lehrer: 'teacher',
    management: 'management',
    standortleitung: 'location_management',
    büro: 'office',
    marketing: 'marketing',
  }

  filter.value = mapping[location] || ''
  filterAndSearchUsers()
}

// User management
const addUser = () => {
  window.location.href = '/registrierung'
}

const goToUser = (id) => {
  window.location.href = '/user'
}

const formatRole = (role) => {
  const roleKey = role.replace(/[\[\]"]/g, '')
  return ROLE_CONFIG.mapping[roleKey] || { name: 'Unbekannt', color: 'rgba(0,0,0,0.1)' }
}

// Dropdown management
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

// Profile Picture Helper
const getInitialsAvatar = (firstName, lastName) => {
  if (!firstName || !lastName) return ''
  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName.charAt(0).toUpperCase()
  return `${firstInitial}${lastInitial}`
}

// Watchers
watch(searchQuery, () => {
  filterAndSearchUsers()
})

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  filterAndSearchUsers()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Demo Statistiken
const stats = ref({
  total: 2451,
  activeToday: 183,
  newThisWeek: 24,
  incomplete: 12,
})

const recentActivities = ref([
  { type: 'new', text: 'Neuer Nutzer registriert', time: 'Vor 2 Minuten', color: 'green' },
  { type: 'update', text: 'Telefonnummer aktualisiert', time: 'Vor 1 Stunde', color: 'purple' },
  { type: 'change', text: 'Adresse geändert', time: 'Vor 3 Stunden', color: 'blue' },
])
</script>

<template>
  <div
    class="absolute bg-window_bg rounded-window shadow-window lg:w-[calc(100%-300px-16px)] w-[100%] sm:h-[56px] h-[calc(56px*2-8px)] left-0 top-0 p-2"
  >
    <div class="h-full max-w-4xl mx-auto space-y-4">
      <div class="flex sm:flex-nowrap flex-wrap items-center justify-between sm:gap-4 gap-2">
        <div class="flex sm:gap-2 gap-0">
          <button
            v-if="activeView === '1' || activeView === '2'"
            @click="goToUrl('')"
            :class="[
              'px-4 py-2 rounded-window font-medium transition-all hover:shadow-lg',
              filter === ''
                ? 'bg-second_accent text-white stroke-white'
                : 'hover:bg-gray-100 bg-gray-50 text-icon_color stroke-icon_color',
            ]"
          >
            Alle
          </button>
          <button
            v-if="activeView === '1' || activeView === '2'"
            @click="goToUrl('lehrer')"
            :class="[
              'px-4 py-2 rounded-window font-medium transition-all hover:shadow-lg',
              filter === 'teacher'
                ? 'bg-second_accent text-white stroke-white'
                : 'hover:bg-gray-100 bg-gray-50 text-icon_color stroke-icon_color',
            ]"
          >
            Lehrer
          </button>
          <button
            v-if="activeView === '1' || activeView === '2' || activeView === '3'"
            @click="goToUrl('schueler')"
            :class="[
              'px-4 py-2 rounded-window font-medium transition-all hover:shadow-lg',
              filter === 'student'
                ? 'bg-second_accent text-white stroke-white'
                : 'hover:bg-gray-100 bg-gray-50 text-icon_color stroke-icon_color',
            ]"
          >
            Schüler
          </button>
          <!-- "Mehr" Button für die restlichen Rollen zum auswählen (filtern) -->
          <div v-if="activeView === '1' || activeView === '2'" class="relative" ref="dropdownRef">
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="px-4 py-2 rounded-window font-medium transition-all hover:shadow-lg flex items-center gap-2"
              :class="
                selectedRole
                  ? 'bg-second_accent text-white stroke-white'
                  : 'hover:bg-gray-100 bg-gray-50 text-icon_color stroke-icon_color'
              "
            >
              <span>{{ selectedRole?.name || 'Mehr' }}</span>
              <svg
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': isDropdownOpen }"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <!-- Dropdown -->
            <div
              v-if="isDropdownOpen"
              class="absolute z-50 mt-2 w-56 rounded-window shadow-lg bg-window_bg border border-gray-100"
            >
              <div class="py-1">
                <button
                  v-for="role in ROLE_CONFIG.additionalRoles"
                  :key="role.key"
                   @click="() => {
                      goToUrl(role.name.toLowerCase())
                      isDropdownOpen = false
                    }"
                  class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                >
                  <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: role.color }" />
                  <span class="text-gray-700">{{ role.name }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-2 sm:justify-start justify-between sm:w-fit w-full">
          <!-- Search -->
          <div class="relative">
            <svg
              class="absolute left-3 top-3 h-4 w-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Suche..."
              class="pl-10 pr-4 py-2 rounded-window bg-window_bg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-second_accent focus:border-transparent"
              style="max-width: 300px; width: 100%; min-width: 150px"
            />
          </div>

          <!-- Add User Button -->
          <button
            v-if="activeView === '1'"
            @click="addUser"
            class="flex items-center gap-2 px-4 py-2 bg-second_accent text-white rounded-window hover:shadow-lg transition-shadow"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M20 8V14M23 11H17M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="xl:block hidden whitespace-nowrap">Neuer Benutzer</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="absolute bg-window_bg rounded-window shadow-window lg:w-[calc(100%-300px-16px)] w-[100%] sm:h-[calc(100%-56px-8px)] h-[calc(100%-56px*2-8px+8px)] left-0 bottom-0 px-2 pb-2 overflow-y-auto"
  >
    <div class="h-full max-w-4xl mx-auto space-y-4">
      <!-- List -->
      <div class="divide-y divide-gray-100">
        <div
          v-for="user in users"
          :key="user.id"
          @click="goToUser(user.id)"
          class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div class="flex-none w-10 h-10 rounded-full overflow-hidden">
              <div
                class="flex items-center justify-center w-full h-full"
                :style="{ backgroundColor: formatRole(user.roles).color }"
              >
                <div class="text-sm font-bold text-second_accent">
                  {{ getInitialsAvatar(user.first_name, user.last_name) }}
                </div>
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-900">
                {{ user.first_name }} {{ user.last_name }}
              </div>
              <div v-if="user.telefon" class="text-sm text-gray-500">{{ user.telefon }}</div>
              <div v-else class="text-sm text-gray-500">{{ user.email }}</div>
            </div>
            <div
              class="px-3 py-1 rounded-lg text-sm font-medium"
              :style="{ backgroundColor: formatRole(user.roles).color }"
            >
              {{ formatRole(user.roles).name }}
            </div>
            <!-- Divider -->
            <div v-if="user.subject_names" class="h-6 bg-gray-300 w-0.5 md:block hidden"></div>
            <div v-if="user.subject_names" class="gap-2 md:flex hidden">
              <span
                v-for="(subject, i) in user.subject_names.split(',')"
                :key="i"
                class="px-2 py-1 rounded-lg text-sm font-medium"
                :style="{
                  backgroundColor: user.subject_colors.split(',')[i] + '15',
                  color: user.subject_colors.split(',')[i],
                }"
              >
                {{ subject }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="users.length === 0 && !loading" class="text-center py-8 text-gray-500">
        Keine Benutzer gefunden
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center py-4">
        <svg class="spinner mx-auto w-8 h-8" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>
  </div>

  <div
    class="absolute bg-window_bg rounded-window shadow-window w-[300px] h-[100%] right-0 top-0 lg:block hidden"
  >
    <div class="w-full h-full flex flex-col rounded-window overflow-y-auto">
      <!-- Hauptinhaltsbereich -->
      <div class="flex-1 flex flex-col gap-4">
        <!-- Rechte Spalte - Schnelle Statistiken & Infos -->
        <div class="flex-[2] space-y-4">
          <!-- Schnelle Statistiken -->
          <div class="bg-window_bg shadow-sm p-4">
            <h3 class="font-semibold mb-4">Statistiken</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-blue-50 rounded-lg">
                <div class="text-sm text-gray-600">Gesamte Nutzer</div>
                <div class="text-2xl font-bold text-blue-600">{{ stats.total }}</div>
              </div>
              <div class="p-4 bg-green-50 rounded-lg">
                <div class="text-sm text-gray-600">Heute aktiv</div>
                <div class="text-2xl font-bold text-green-600">{{ stats.activeToday }}</div>
              </div>
              <div class="p-4 bg-purple-50 rounded-lg">
                <div class="text-sm text-gray-600">Neu diese Woche</div>
                <div class="text-2xl font-bold text-purple-600">{{ stats.newThisWeek }}</div>
              </div>
              <div class="p-4 bg-orange-50 rounded-lg">
                <div class="text-sm text-gray-600">Unvollständig</div>
                <div class="text-2xl font-bold text-orange-600">{{ stats.incomplete }}</div>
              </div>
            </div>
          </div>

          <!-- Letzte Aktivitäten -->
          <div class="bg-window_bg shadow-sm p-4">
            <h3 class="font-semibold mb-4">Letzte Aktivitäten</h3>
            <div class="space-y-4">
              <div
                v-for="(activity, index) in recentActivities"
                :key="index"
                class="flex items-start gap-3"
              >
                <div
                  class="p-2 w-6 h-6 rounded-lg"
                  :class="{
                    'bg-green-50': activity.color === 'green',
                    'bg-purple-50': activity.color === 'purple',
                    'bg-blue-50': activity.color === 'blue',
                  }"
                ></div>
                <div>
                  <div class="text-sm font-medium">{{ activity.text }}</div>
                  <div class="text-xs text-gray-500">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Schnelle Aktionen -->
          <div class="bg-window_bg shadow-sm p-4">
            <h3 class="font-semibold mb-4">Aktionen</h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                class="p-3 text-sm font-medium bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Nutzerliste exportieren
              </button>
              <button
                class="p-3 text-sm font-medium bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Statistiken exportieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
