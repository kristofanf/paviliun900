import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AirbnbDetail from '../components/AirbnbDetail.vue'
import ImageGallery from '../components/ImageGallery.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    props: true
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path:'/detail',
    name:'detail',
    component:AirbnbDetail,
    props: true
  },
  {
    path:'/image',
    name:'image',
    component:ImageGallery,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
}
})

export default router
