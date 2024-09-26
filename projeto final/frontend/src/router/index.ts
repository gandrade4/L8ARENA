/*
import { createWebHistory, createRouter } from 'vue-router'

import PublicHome from '@/pages/PublicHome.vue'
import UserInDetails from '@/pages/UserInDetails.vue'
import LoginPage from '@/pages/LoginPage.vue'
import { useUserStore } from '@/stores/userStore'

const routes = [
  {
    path: '/',
    component: PublicHome,
    meta: { requiresAuth: false }
  },
  { path: '/users/:id', component: UserInDetails, meta: { requiresAuth: false } },
  { path: '/users/new', component: UserInDetails, meta: { requiresAuth: false } },
  { path: '/login', component: LoginPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

/*
router.beforeEach((to, from) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return '/login'
  }
})
  */

import { createWebHistory, createRouter } from 'vue-router'

import PublicHome from '@/pages/PublicHome.vue'
import UserInDetails from '@/pages/UserInDetails.vue'
import LoginPage from '@/pages/LoginPage.vue'
import QuadraInDetails from '@/pages/QuadraInDetails.vue'
import QuadraPage from '@/pages/QuadraPage.vue'
import ReservaQuadra from '@/pages/ReservaQuadra.vue'
import { useUserStore } from '@/stores/userStore'
import CreateQuadra from '@/pages/CreateQuadra.vue'
 
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  { path: '/users/:id', component: UserInDetails, meta: { requiresAuth: false } }, 
  { path: '/users/new', component: UserInDetails, meta: { requiresAuth: false } },
  { path: '/login', component: LoginPage },
  { path: '/quadras/:id', component: QuadraInDetails, meta: { requiresAuth: true } },
  { path: '/quadras', component: QuadraPage, meta: { requiresAuth: true } },
  { path: '/reservas', component: ReservaQuadra, meta: { requiresAuth: true } },
  { path: '/quadras/new', component: CreateQuadra, meta: { requiresAuth: true } }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

/*
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else if (to.path.startsWith('/quadras') && userStore.role !== 'admin') {
    next('/login')
  } else if (to.path === '/reservas' && userStore.role !== 'user') {
    next('/login')
  } else {
    next()
  }
})
*/