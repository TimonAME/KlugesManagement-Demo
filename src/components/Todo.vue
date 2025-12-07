<script setup>
import { ref, computed, watch } from 'vue'
import ViewGrouped from '../components/todo/ViewGrouped.vue'
import ViewList from '../components/todo/ViewList.vue'
import AddTaskModal from '../components/todo/AddTaskModal.vue'
import { debounce } from 'lodash'

// Demo-Daten
const demoTodos = [
  {
    id: 1,
    title: 'Demo Aufgabe 1',
    completed: false,
    dueDate: { date: '2025-12-06' },
    userTodos: [{ user: { id: 1 } }],
    creator: [{ user: { id: 2, first_name: 'Max', last_name: 'Mustermann' } }],
  },
  {
    id: 2,
    title: 'Demo Aufgabe 2',
    completed: false,
    dueDate: { date: '2025-12-07' },
    userTodos: [{ user: { id: 1 } }],
    creator: [{ user: { id: 2, first_name: 'Max', last_name: 'Mustermann' } }],
  },
  {
    id: 3,
    title: 'Demo Aufgabe 3',
    completed: true,
    dueDate: null,
    userTodos: [{ user: { id: 1 } }],
    creator: [{ user: { id: 2, first_name: 'Max', last_name: 'Mustermann' } }],
  },
  {
    id: 4,
    title: 'Demo Aufgabe 4',
    completed: false,
    dueDate: { date: '2025-12-08' },
    userTodos: [{ user: { id: 2 } }],
    creator: [{ user: { id: 2, first_name: 'Max', last_name: 'Mustermann' } }],
  },
]

const activeView = ref('heute')
const searchQuery = ref('')
const isDropdownOpen = ref(false)
const isOpen = ref(false)
const isLoading = ref(false)
const todos = ref([...demoTodos])
const pendingView = ref(null)
const loadingTodos = ref([])

/********** FETCH TODOs (Fake) **********/
const viewToFilter = {
  heute: (todo) =>
    todo.dueDate && new Date(todo.dueDate.date).toDateString() === new Date().toDateString(),
  demnächst: (todo) => todo.dueDate && new Date(todo.dueDate.date) > new Date(),
  eingang: (todo) => !todo.completed,
  erledigt: (todo) => todo.completed,
  suche: (todo) =>
    searchQuery.value ? todo.title.toLowerCase().includes(searchQuery.value.toLowerCase()) : true,
}

const fetchTodos = async (view = activeView.value) => {
  isLoading.value = true

  // Fake Ladezeit
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))

  // Filter basierend auf View
  todos.value = demoTodos.filter(viewToFilter[view])

  isLoading.value = false
}

// Watch für Suche
watch(
  searchQuery,
  debounce(() => {
    if (activeView.value === 'suche') {
      fetchTodos()
    }
  }, 300),
)

const updateSearchQuery = (query) => {
  searchQuery.value = query
}

/********* TODO LISTS *********/
const filteredTodos = computed(() => todos.value)

const groupedTodos = computed(() => {
  if (activeView.value !== 'demnächst') return null

  const grouped = { 'Kein Datum': [] }
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  todos.value.forEach((todo) => {
    if (!todo.dueDate || !todo.dueDate.date) {
      grouped['Kein Datum'].push(todo)
    } else {
      try {
        const dateStr = todo.dueDate.date
        const date = new Date(dateStr)

        if (isNaN(date.getTime())) {
          grouped['Kein Datum'].push(todo)
          return
        }

        const dateKey = date.toISOString().split('T')[0]
        const compareDate = new Date(dateKey)

        if (compareDate <= today) return

        if (!grouped[dateKey]) grouped[dateKey] = []
        grouped[dateKey].push(todo)
      } catch {
        grouped['Kein Datum'].push(todo)
      }
    }
  })

  return Object.entries(grouped)
    .sort(([a], [b]) =>
      a === 'Kein Datum' ? -1 : b === 'Kein Datum' ? 1 : new Date(a) - new Date(b),
    )
    .map(([dueDate, todos]) => ({
      dueDate,
      formattedDate:
        dueDate === 'Kein Datum'
          ? 'Kein Datum'
          : new Date(dueDate).toLocaleDateString('de-DE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
      todos,
    }))
})
/********* TODO LISTS *********/

/********* COUNTS *********/
const activeTodosCount = computed(() => {
  if (activeView.value === 'demnächst') {
    return groupedTodos.value
      ? groupedTodos.value.reduce((count, group) => count + group.todos.length, 0)
      : 0
  }
  return filteredTodos.value.length
})
/********* COUNTS *********/

/********* EMITS (Fake) *********/
const toggleTodoStatus = async (todo) => {
  if (loadingTodos.value.includes(todo.id)) return
  loadingTodos.value.push(todo.id)

  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300))

  todo.completed = !todo.completed

  if (activeView.value !== 'erledigt') {
    todos.value = todos.value.filter((t) => t.id !== todo.id)
  }

  loadingTodos.value = loadingTodos.value.filter((id) => id !== todo.id)
}

const handleAddTodo = async (newTodo) => {
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300))
  const id = Math.max(...demoTodos.map((t) => t.id)) + 1
  const todo = {
    ...newTodo,
    id,
    dueDate: newTodo.dueDate || null,
    completed: false,
    userTodos: [{ user: { id: 1 } }],
  }
  todos.value.push(todo)
  demoTodos.push(todo)
}

const handleUpdateTodo = async (updatedTodo) => {
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300))
  const index = todos.value.findIndex((t) => t.id === updatedTodo.id)
  if (index !== -1) todos.value[index] = { ...updatedTodo }
  const demoIndex = demoTodos.findIndex((t) => t.id === updatedTodo.id)
  if (demoIndex !== -1) demoTodos[demoIndex] = { ...updatedTodo }
}

const handleDeleteTodo = async (todo) => {
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300))
  todos.value = todos.value.filter((t) => t.id !== todo.id)
  const demoIndex = demoTodos.findIndex((t) => t.id === todo.id)
  if (demoIndex !== -1) demoTodos.splice(demoIndex, 1)
}
/********* EMITS *********/

/********* CHANGE VIEW *********/
const aufgabenRef = ref(null)

const changeView = async (newView) => {
  if (isLoading.value || activeView.value === newView) return

  pendingView.value = newView
  isLoading.value = true

  if (aufgabenRef.value) aufgabenRef.value.scrollTo({ top: 0 })

  await fetchTodos(newView)
  activeView.value = newView

  isLoading.value = false
  pendingView.value = null
}
/********* CHANGE VIEW *********/
</script>

<template>
  <!-- Ansichten, Linke Spalte -->
  <div
    class="absolute bg-window_bg rounded-window shadow-lg md:w-[300px] w-full md:h-[100%] h-[56px] left-0 top-0 p-2"
  >
    <!-- Desktop Header -->
    <div class="md:block hidden space-y-2">
      <!-- Add Todo Button -->
      <button
        @click="isOpen = true"
        class="flex flex-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors cursor-pointer select-none hover:bg-gray-100 group/add"
      >
        <div class="flex items-center gap-4">
          <svg
            class="w-6 h-6 stroke-second-accent group-hover/add:hidden block"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 5V19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5 12H19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg
            class="w-6 h-6 stroke-second-accent group-hover/add:block hidden"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M12 8V16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 12H16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p class="text-sm text-second_accent">Aufgabe hinzufügen</p>
        </div>
      </button>

      <!-- Kategorien -->
      <button
        @click="changeView('heute')"
        :class="[
          'flex flex-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors',
          activeView === 'heute'
            ? 'bg-second_accent text-white stroke-white'
            : 'hover:bg-gray-100 stroke-icon-color',
        ]"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 6V12L16 14"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Heute</span>
      </button>
      <button
        @click="changeView('demnächst')"
        :class="[
          'flex flex-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors',
          activeView === 'demnächst'
            ? 'bg-second_accent text-white stroke-white'
            : 'hover:bg-gray-100 stroke-icon-color',
        ]"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M16 2V6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M8 2V6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3 10H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Demnächst</span>
      </button>
      <button
        @click="changeView('eingang')"
        :class="[
          'flex flex-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors',
          activeView === 'eingang'
            ? 'bg-second_accent text-white stroke-white'
            : 'hover:bg-gray-100 stroke-icon-color',
        ]"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22 12H16L14 15H10L8 12H2"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11V5.11Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Eingang</span>
      </button>
      <button
        @click="changeView('suche')"
        :class="[
          'flex flex-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors',
          activeView === 'suche'
            ? 'bg-second_accent text-white stroke-white'
            : 'hover:bg-gray-100 stroke-icon-color',
        ]"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M21.0004 21L16.6504 16.65"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Suche</span>
      </button>
      <button
        @click="changeView('erledigt')"
        :class="[
          'flex flex-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors',
          activeView === 'erledigt'
            ? 'bg-second_accent text-white stroke-white'
            : 'hover:bg-gray-100 stroke-icon-color',
        ]"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 6L9 17L4 12"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Erledigt</span>
      </button>
    </div>

    <!-- Mobile Header -->
    <div class="block md:hidden space-y-2">
      <button
        @click="isDropdownOpen = !isDropdownOpen"
        class="flex flex-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors bg-second_accent text-white stroke-white"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 6V12L16 14"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="capitalize">{{ activeView }}</span>
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 9L12 15L18 9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div
        v-if="isDropdownOpen"
        class="space-y-2 z-30 relative top-4 bg-window_bg shadow-2xl rounded-window p-2"
      >
        <button
          @click="() => {
              changeView('heute')
              isDropdownOpen = false
            }"
          :class="[
            'flex felx-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors',
            activeView === 'heute'
              ? 'bg-second_accent text-white stroke-white'
              : 'hover:bg-gray-100 stroke-icon-color',
          ]"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 6V12L16 14"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Heute</span>
        </button>
        <button
          @click="() => {
              changeView('demnächst')
              isDropdownOpen = false
            }"
          :class="[
            'flex felx-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors',
            activeView === 'demnächst'
              ? 'bg-second_accent text-white stroke-white'
              : 'hover:bg-gray-100 stroke-icon-color',
          ]"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M16 2V6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 2V6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3 10H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Demnächst</span>
        </button>
        <button
          @click="() => {
              changeView('eingang')
            isDropdownOpen = false
            }"
          :class="[
            'flex felx-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors',
            activeView === 'eingang'
              ? 'bg-second_accent text-white stroke-white'
              : 'hover:bg-gray-100 stroke-icon-color',
          ]"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22 12H16L14 15H10L8 12H2"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11V5.11Z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Eingang</span>
        </button>
        <button
           @click="() => {
              changeView('suche')
            isDropdownOpen = false
            }"
          :class="[
            'flex felx-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors',
            activeView === 'suche'
              ? 'bg-second_accent text-white stroke-white'
              : 'hover:bg-gray-100 stroke-icon-color',
          ]"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21.0004 21L16.6504 16.65"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Suche</span>
        </button>
        <button
          @click="() => {
              changeView('erledigt')
            isDropdownOpen = false
            }"
          :class="[
            'flex felx-row gap-2 items-center w-full text-left px-4 py-2 rounded-window transition-colors',
            activeView === 'erledigt'
              ? 'bg-second_accent text-white stroke-white'
              : 'hover:bg-gray-100 stroke-icon-color',
          ]"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 6L9 17L4 12"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Erledigt</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Aufgaben -->
  <div
    ref="aufgabenRef"
    class="absolute bg-window_bg rounded-window shadow-lg md:w-[calc(100%-300px-16px)] w-full md:h-[100%] h-[calc(100%-56px-16px)] right-0 md:top-0 top-[calc(56px+8px)] p-4 overflow-x-hidden overflow-y-auto"
    :class="isOpen ? 'overflow-y-hidden' : 'overflow-y-auto'"
  >
    <!-- gap on both sides -->
    <div class="xl:mx-[10%] mx-auto">
      <!-- Titel und Anzahl der Todos -->
      <h2 class="text-2xl font-bold mb-2">
        {{ activeView.charAt(0).toUpperCase() + activeView.slice(1) }}
      </h2>
      <p class="flex flex-row items-center text-sm text-gray-400 stroke-gray-400 mb-6">
        <svg
          class="w-4 h-4 mr-1"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22 4L12 14.01L9 11.01"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ activeTodosCount }} Aufgaben</span>
      </p>
      <AddTaskModal v-if="isOpen" @add="handleAddTodo" @close="isOpen = false" />

      <ViewGrouped
        v-if="activeView === 'demnächst' && groupedTodos"
        :groupedTodos="groupedTodos"
        :activeView="activeView"
        :loadingTodos="loadingTodos"
        @toggleTodoStatus="toggleTodoStatus"
        @handleAddTodo="handleAddTodo"
        @handleUpdateTodo="handleUpdateTodo"
        @handleDeleteTodo="handleDeleteTodo"
      />

      <ViewList
        v-else
        :filteredTodos="filteredTodos"
        :activeView="activeView"
        :loadingTodos="loadingTodos"
        @toggleTodoStatus="toggleTodoStatus"
        @handleAddTodo="handleAddTodo"
        @handleUpdateTodo="handleUpdateTodo"
        @handleDeleteTodo="handleDeleteTodo"
        @updateSearchQuery="updateSearchQuery"
      />
    </div>

    <div
      v-if="isLoading"
      class="absolute inset-0 backdrop-blur z-50 flex items-center justify-center"
    >
      <div class="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
        <svg
          class="animate-spin h-5 w-5 text-second_accent"
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
        <span class="text-gray-700">Lade...</span>
      </div>
    </div>
  </div>
</template>
