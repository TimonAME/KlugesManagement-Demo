import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import Notifications from '@/components/Notifications.vue'
import Todo from '@/components/Todo.vue'
import MarketingMaterials from '@/components/MarketingMaterials.vue'
import TeachingMaterials from '@/components/TeachingMaterials.vue'
import Tipps from '@/components/Tipps.vue'
import Chat from '@/components/Chat.vue'
import UserList from '@/components/UserList.vue'
import Registration from '@/components/Registration.vue'
import UserProfile from '@/components/UserProfile.vue'
import Calendar from '@/components/Calendar.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/todo',
      name: 'todo',
      component: Todo,
    },
    {
      path: '/marketing',
      name: 'marketing',
      component: MarketingMaterials,
    },
    {
      path: '/lernmaterialien',
      name: 'lernmaterialien',
      component: TeachingMaterials,
    },
    {
      path: '/tipps',
      name: 'tipps',
      component: Tipps,
    },
    {
      path: '/benachrichtigungen',
      name: 'benachrichtigungen',
      component: Notifications,
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
    },
    {
      path: '/benutzerliste',
      name: 'benutzerliste',
      component: UserList,
    },
    {
      path: '/registrierung',
      name: 'registrierung',
      component: Registration,
    },
    {
      path: '/user',
      name: 'user',
      component: UserProfile,
    },
    {
      path: '/user/:kategory',
      name: 'userKategory',
      component: UserProfile,
    },
    {
      path: '/kalender',
      name: 'kalender',
      component: Calendar,
    },
    {
      path: '/arbeitsstunden',
      name: 'arbeitsstunden',
      component: Calendar,
    },
  ],
})

export default router
