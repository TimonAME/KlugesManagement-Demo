<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import BaseLayout from './components/BaseLayout.vue'

const userRole = 'ROLE_MANAGEMENT'
const userID = 1
</script>

<template>
  <BaseLayout :userRole="userRole" :userID="userID">
    <RouterView />
  </BaseLayout>
</template>

<style scoped></style>
