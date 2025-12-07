<template>
  <div class="flex">
    <div class="z-40">
      <Navbar :role="userRole" />
    </div>
    <div class="grow" id="app">
      <div class="h-svh min-h-screen bg-first_bg flex flex-col">
        <header class="px-4 pt-3 flex flex-row items-center justify-between mb-3 max-w-svw">
          <h1
            class="text-main sm:text-3xl text-2xl font-semibold cursor-pointer truncate max-w-44 sm:max-w-none"
            @click="reloadPage"
          >
            <slot name="pageTitle">{{ pageTitle }}</slot>
          </h1>
          <UserMenu :role="userRole" :userID="userID" />
        </header>
        <div class="grow px-4 pb-4 overflow-auto">
          <div class="relative h-[calc(100vh-80px)]">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './Navbar.vue'
import UserMenu from './UserMenu.vue'

const props = defineProps({
  userRole: {
    type: String,
    required: true,
  },
  userID: {
    type: Number,
    required: true,
  },
})

const reloadPage = () => {
  location.reload()
}

// --- Route-based page title ---
const route = useRoute()

// small helper: humanize "benachrichtigungen" -> "Benachrichtigungen"
function humanizeSegment(seg) {
  if (!seg) return ''
  // replace dashes/underscores, split words and capitalize first letter of each
  return seg
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

const pageTitle = computed(() => {
  // priority:
  // 1) route.meta.title (if you later add it to routes)
  // 2) route.name (if defined)
  // 3) last path segment
  if (route.meta && route.meta.title) return route.meta.title
  if (route.name) return humanizeSegment(String(route.name))
  const parts = (route.path || '').split('/').filter(Boolean)
  if (parts.length === 0) return 'Home'
  return humanizeSegment(parts[parts.length - 1])
})

// set document.title so browser tab shows it
watchEffect(() => {
  if (pageTitle.value) {
    document.title = pageTitle.value
  }
})
</script>

<style scoped></style>
