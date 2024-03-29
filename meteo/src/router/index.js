// Gère simplement les trois grandes routes de l'application : accueil, la map et les détails d'une sonde.

import { createRouter, createWebHistory } from 'vue-router'

import MapView from '../views/MapView.vue'
import HomeView from '../views/HomeView.vue'
import SondeView from '../views/SondeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/sondes/:id',
      component: SondeView,
      props: true
    },
    {
      path: '/map',
      name: 'map',
      component: MapView
    }
  ]
})

export default router
