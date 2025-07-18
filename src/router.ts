// src/router.js
import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import GroceryList from './pages/GroceryList.vue'
// import About from './pages/About.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/liste/:id', name: 'GroceryList', component: GroceryList }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
