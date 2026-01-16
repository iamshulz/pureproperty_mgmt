import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Agents from '@/views/Agents.vue'
import Properties from '@/views/Properties.vue'
import Families from '@/views/Families.vue'
import Tenants from '@/views/Tenants.vue'
import Reminders from '@/views/Reminders.vue'
import Notes from '@/views/Notes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/agents', name: 'agents', component: Agents },
    { path: '/properties', name: 'properties', component: Properties },
    { path: '/families', name: 'families', component: Families },
    { path: '/tenants', name: 'tenants', component: Tenants },
    { path: '/reminders', name: 'reminders', component: Reminders },
    { path: '/notes', name: 'notes', component: Notes },
  ],
})

export default router
