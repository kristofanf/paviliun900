import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import units from '@/data/units.json'
import { findUnitByRoute, unitSlug } from '@/utils/unit-slug'

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
    path: '/detail/:slug?',
    name: 'detail',
    component: () => import('@/components/AirbnbDetail.vue'),
  },
  {
    path: '/image/:slug?',
    name: 'image',
    component: () => import('@/components/ImageGallery.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    if (to.hash) return { el: to.hash, top: 24, behavior }
    return { left: 0, top: 0, behavior: 'auto' }
  },
})

// Keep ID/session-based bookmarks working while all public links use text slugs.
router.beforeEach(to => {
  if (!['detail', 'image'].includes(to.name)) return
  let value = to.params.slug
  if (!value) {
    try { value = String(JSON.parse(sessionStorage.getItem('unit'))?.id ?? '') } catch { /* Ignore stale browser data. */ }
  }
  const unit = findUnitByRoute(units, value)
  if (!unit) return { name: 'home', replace: true }
  const slug = unitSlug(unit, units)
  if (to.params.slug !== slug) {
    return { name: to.name, params: { slug }, query: to.query, hash: to.hash, replace: true }
  }
})

export default router
