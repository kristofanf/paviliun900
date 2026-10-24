import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import units from '@/data/units.json'

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
    path: '/detail/:id?',
    name: 'detail',
    component: () => import('@/components/AirbnbDetail.vue'),
  },
  {
    path: '/image/:id?',
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

// Resolve legacy links once; route IDs make details shareable without browser storage.
router.beforeEach(to => {
  if (!['detail', 'image'].includes(to.name)) return
  let id = to.params.id
  if (!id) {
    try { id = JSON.parse(sessionStorage.getItem('unit'))?.id } catch { /* Ignore stale browser data. */ }
    if (id) return { name: to.name, params: { id: String(id) }, replace: true }
  }
  if (!units.some(unit => String(unit.id) === String(id))) return { name: 'home', replace: true }
})

export default router
