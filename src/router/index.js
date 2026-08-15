import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/components/AirbnbDetail.vue'),
  },
  {
    path: '/image',
    name: 'image',
    component: () => import('@/components/ImageGallery.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    document.getElementById('app')?.scrollIntoView({ behavior: 'smooth' })
  },
})

export default router
