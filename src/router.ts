// src/router.js
import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import GroceryList from './pages/GroceryList.vue'
import SignIn from './pages/SignIn.vue'
import Todo from './pages/Todo.vue'
import TodoList from './pages/TodoList.vue'
// import About from './pages/About.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/signin', name: 'SignIn', component: SignIn },

  { path: '/todo', name: 'Todo', component: Todo },
  { path: '/todo/:id', name: 'TodoList', component: TodoList },
  
  { path: '/grocery', name: 'Grocery', component: Home },
  { path: '/liste/:id', name: 'GroceryList', component: GroceryList },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
