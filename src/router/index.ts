import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/About.vue'),
  },
  {
    path: '/tools/image-compression',
    name: 'image-compression',
    component: () => import('@/pages/tools/ImageCompression.vue'),
  },
  // Placeholders for other tools
  {
    path: '/tools/json-formatter',
    name: 'json-formatter',
    component: () => import('@/pages/Home.vue'), // Redirect to home or show placeholder
  },
  {
    path: '/tools/color-picker',
    name: 'color-picker',
    component: () => import('@/pages/Home.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
