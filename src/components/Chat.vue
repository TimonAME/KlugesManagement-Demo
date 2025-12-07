<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// Demo-Daten
const demoUsers = [
  { id: 1, first_name: 'Max', last_name: 'Mustermann', email: 'max@example.com' },
  { id: 2, first_name: 'Anna', last_name: 'Müller', email: 'anna@example.com' },
  { id: 3, first_name: 'Tom', last_name: 'Meier', email: 'tom@example.com' },
  { id: 4, first_name: 'Lisa', last_name: 'Schmidt', email: 'lisa@example.com' },
  { id: 5, first_name: 'Jonas', last_name: 'Klein', email: 'jonas@example.com' },
]

const demoConversations = [
  {
    id: 101,
    last_message: { content: "Hi, wie geht's?", created_at: { date: '2025-12-06T09:30:00' } },
    partnerUser: demoUsers[0],
  },
  {
    id: 102,
    last_message: { content: 'Alles klar!', created_at: { date: '2025-12-05T14:15:00' } },
    partnerUser: demoUsers[1],
  },
  {
    id: 103,
    last_message: { content: 'Hallo Lisa!', created_at: { date: '2025-12-04T10:00:00' } },
    partnerUser: demoUsers[3],
  },
  {
    id: 104,
    last_message: { content: 'Hey Jonas!', created_at: { date: '2025-12-03T11:20:00' } },
    partnerUser: demoUsers[4],
  },
]

const demoMessages = {
  101: [
    {
      id: 1,
      content: "Hi, wie geht's?",
      sender: { id: 1, first_name: 'Max' },
      created_at: { date: '2025-12-06T09:30:00' },
    },
    {
      id: 2,
      content: 'Gut, danke! Und dir?',
      sender: { id: 999, first_name: 'Demo' },
      created_at: { date: '2025-12-06T09:32:00' },
    },
    {
      id: 3,
      content: "Mir geht's auch super!",
      sender: { id: 1, first_name: 'Max' },
      created_at: { date: '2025-12-06T09:33:00' },
    },
  ],
  102: [
    {
      id: 3,
      content: 'Hey, hast du heute Zeit?',
      sender: { id: 999, first_name: 'Demo' },
      created_at: { date: '2025-12-05T14:10:00' },
    },
    {
      id: 4,
      content: 'Alles klar!',
      sender: { id: 2, first_name: 'Anna' },
      created_at: { date: '2025-12-05T14:15:00' },
    },
    {
      id: 5,
      content: 'Super!',
      sender: { id: 999, first_name: 'Demo' },
      created_at: { date: '2025-12-05T14:16:00' },
    },
  ],
  103: [
    {
      id: 5,
      content: 'Hallo Lisa!',
      sender: { id: 999, first_name: 'Demo' },
      created_at: { date: '2025-12-04T10:00:00' },
    },
    {
      id: 6,
      content: "Hi! Wie geht's?",
      sender: { id: 4, first_name: 'Lisa' },
      created_at: { date: '2025-12-04T10:05:00' },
    },
    {
      id: 7,
      content: 'Gut, danke!',
      sender: { id: 999, first_name: 'Demo' },
      created_at: { date: '2025-12-04T10:06:00' },
    },
  ],
  104: [
    {
      id: 7,
      content: 'Hey Jonas!',
      sender: { id: 999, first_name: 'Demo' },
      created_at: { date: '2025-12-03T11:20:00' },
    },
    {
      id: 8,
      content: 'Hey, alles klar?',
      sender: { id: 5, first_name: 'Jonas' },
      created_at: { date: '2025-12-03T11:22:00' },
    },
    {
      id: 9,
      content: 'Ja, alles bestens!',
      sender: { id: 999, first_name: 'Demo' },
      created_at: { date: '2025-12-03T11:23:00' },
    },
  ],
}

// State
const users = ref([])
const conversations = ref(demoConversations)
const searchQuery = ref('')
const showDropdown = ref(false)
const isLoading = ref(false)
const newMessage = ref('')
const chatContainer = ref(null)
const chatID = ref(null)
const messages = ref([])
const otherUser = ref(null)
const currentUserId = 999

// Chat öffnen
const openChat = (id) => {
  chatID.value = id
  messages.value = demoMessages[id] || []
  const conv = conversations.value.find((c) => c.id === id)
  if (conv) otherUser.value = conv.partnerUser
}

// Chat erstellen
const createChat = (id) => {
  const newChatId = Math.floor(Math.random() * 1000) + 200
  const user = demoUsers.find((u) => u.id === id)
  conversations.value.push({
    id: newChatId,
    last_message: null,
    partnerUser: user,
  })
  chatID.value = newChatId
  messages.value = []
  otherUser.value = user
  demoMessages[newChatId] = []
}

// Nachricht senden
const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const messageObj = {
    id: Math.floor(Math.random() * 10000),
    content: newMessage.value,
    sender: { id: currentUserId, first_name: 'Demo' },
    created_at: { date: new Date().toISOString() },
  }

  messages.value.push(messageObj)

  // Update last message
  const conv = conversations.value.find((c) => c.id === chatID.value)
  if (conv) conv.last_message = { content: newMessage.value, created_at: messageObj.created_at }

  newMessage.value = ''
  await nextTick(scrollToBottom)
}

// Scroll helper
const scrollToBottom = () => {
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
}

// Watch messages
watch(
  messages,
  (newVal) => {
    if (newVal?.length) nextTick(scrollToBottom)
  },
  { deep: true },
)

// Format time
const formatTime = (dateTimeObj) => {
  if (!dateTimeObj) return ''
  const date = new Date(dateTimeObj.date)
  const now = new Date()
  const timeString = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

  if (date.toDateString() === now.toDateString()) return timeString
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return `Gestern, ${timeString}`
  return (
    date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    }) + `, ${timeString}`
  )
}

// Auto-resize Textarea
const autoResize = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

const router = useRouter()

const goToUser = (id) => {
  router.push({ name: 'user' })
}

// Search functionality
watch(searchQuery, (newVal) => {
  if (newVal.trim()) {
    showDropdown.value = true
    users.value = demoUsers.filter(
      (u) =>
        u.first_name.toLowerCase().includes(newVal.toLowerCase()) ||
        u.last_name.toLowerCase().includes(newVal.toLowerCase()) ||
        u.email.toLowerCase().includes(newVal.toLowerCase()),
    )
  } else {
    showDropdown.value = false
    users.value = []
  }
})

onMounted(() => {
  nextTick(scrollToBottom)
})
</script>

<template>
  <div
    class="absolute bg-window_bg rounded-window shadow-window md:w-[300px] w-full h-[100%] left-0 bottom-0 z-20 transition-transform duration-300 ease-in-out"
    :class="chatID ? 'md:block hidden' : ''"
  >
    <div class="h-[100%] overflow-y-auto p-2">
      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          class="w-full pl-10 pr-4 py-2 bg-window_bg border border-gray-200 rounded-window focus:ring-2 focus:ring-first-accent focus:border-transparent"
          placeholder="Benutzer suchen..."
        />
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <div v-if="isLoading" class="absolute right-3 top-2.5">
          <svg
            class="animate-spin h-5 w-5 text-gray-400"
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
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="showDropdown && users.length > 0" class="mt-2 space-y-2">
        <div
          v-for="user in users"
          :key="user.id"
          @click="
            () => {
              createChat(user.id)
              showDropdown = false
              searchQuery = ''
            }
          "
          class="flex items-center p-3 rounded-window hover:bg-[#d19cff4b] cursor-pointer"
        >
          <div class="flex items-center justify-center w-10 h-10 bg-[#a38cff51] rounded-full">
            <div class="text-sm font-bold text-second-accent">{{ user.first_name[0] }}</div>
          </div>
          <div class="ml-3">
            <p class="font-medium">{{ user.first_name }} {{ user.last_name }}</p>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="showDropdown && searchQuery && !users.length && !isLoading"
        class="mt-2 p-4 text-center text-gray-500"
      >
        No users found
      </div>

      <!-- Existing Conversations -->
      <div class="mt-4 space-y-2">
        <h3 class="font-medium text-gray-700 px-3">Aktuelle Gespräche</h3>
        <div
          v-for="conv in conversations"
          :key="conv.id"
          @click="openChat(conv.id)"
          class="flex items-center p-3 rounded-window cursor-pointer transition-colors duration-200"
          :class="[chatID === conv.id ? 'bg-gray-200' : 'hover:bg-gray-100']"
        >
          <div class="flex items-center justify-center w-10 h-10 bg-[#a38cff51] rounded-full">
            <div class="text-sm font-bold text-second-accent">
              {{ conv.partnerUser.first_name[0] }}
            </div>
          </div>
          <div class="ml-3 min-w-0 flex-1">
            <div class="flex justify-between items-center gap-1">
              <p class="font-medium truncate max-w-[140px]">
                {{ conv.partnerUser.first_name }} {{ conv.partnerUser.last_name }}
              </p>
              <span
                v-if="conv.last_message?.created_at"
                class="text-xs flex-shrink-0 text-gray-500"
              >
                {{ formatTime(conv.last_message.created_at) }}
              </span>
            </div>
            <p class="text-sm truncate text-gray-500">
              {{ conv.last_message?.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="absolute bg-window_bg rounded-window shadow-window md:w-[calc(100%-300px-16px)] w-full h-[100%] right-0 bottom-0 z-10"
  >
    <div v-if="chatID !== null" class="h-full flex flex-col">
      <!-- Chat Header -->
      <div class="p-4 border-b flex justify-between items-center">
        <div class="flex items-center">
          <div class="flex items-center justify-center w-10 h-10 bg-[#a38cff51] rounded-full mr-3">
            <div class="text-sm font-bold text-second-accent">{{ otherUser?.first_name[0] }}</div>
          </div>
          <h2 class="font-medium cursor-pointer" @click="goToUser(otherUser?.id)">
            {{ otherUser?.first_name }} {{ otherUser?.last_name }}
          </h2>
        </div>
        <!-- Mobile "close" button to navigate back to chat list "/chat" -->
        <a href="/chat" class="md:hidden">
          <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </div>

      <!-- Messages -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['flex', message.sender?.id === otherUser?.id ? 'justify-start' : 'justify-end']"
        >
          <div class="flex flex-col">
            <div
              class="flex items-end gap-2"
              :class="{ 'flex-row-reverse': message.sender?.id !== otherUser?.id }"
            >
              <div class="flex items-center justify-center w-8 h-8 bg-[#a38cff51] rounded-full">
                <div class="text-sm font-bold text-second-accent">
                  {{ message.sender?.first_name[0] }}
                </div>
              </div>
              <div
                :class="[
                  'max-w-[70%] rounded-lg p-3',
                  message.sender?.id === otherUser?.id ? 'bg-gray-100' : 'bg-main text-white',
                ]"
              >
                {{ message.content }}
              </div>
            </div>
            <span
              class="text-xs text-gray-500 mt-1"
              :class="{ 'text-right': message.sender?.id !== otherUser?.id }"
            >
              {{ formatTime(message.created_at) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-4 border-t">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <textarea
            v-model="newMessage"
            @input="autoResize"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact.prevent="newMessage += '\n'"
            rows="1"
            class="flex-1 rounded-lg border p-2 focus:ring-2 focus:ring-first-accent focus:outline-none focus:border-transparent resize-none"
            placeholder="Nachricht eingeben"
            style="min-height: 40px; max-height: 200px"
          ></textarea>
          <button
            type="submit"
            class="h-fit bg-main text-white rounded-lg px-4 py-2 hover:text-first-accent"
          >
            Senden
          </button>
        </form>
      </div>
    </div>

    <div v-else class="h-full flex items-center justify-center text-gray-500">
      Wählen Sie eine Konversation aus oder starten Sie einen neuen Chat
    </div>
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  display: none;
}
</style>
