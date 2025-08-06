// src/router.js
import { useAuthService } from './composables/useAuthService'
import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import GroceryList from './pages/GroceryList.vue'
import SignIn from './pages/SignIn.vue'
import Todo from './pages/Todo.vue'
import TodoList from './pages/TodoList.vue'
import Recipe from './pages/Recipe.vue'
import RecipeDetail from './pages/RecipeDetail.vue'
import User from './pages/User.vue'
import SignUp from './pages/SignUp.vue'
import { watch } from 'vue'
import Contacts from './pages/Contacts.vue'

const routes = [
  { path: '/signin', name: 'SignIn', component: SignIn, meta: {guestOnly: true, authLayout: true} },
  { path: '/signup', name: 'SignUp', component: SignUp, meta: {guestOnly: true, authLayout: true} },
  
  { path: '/', name: 'Home', component: Home, meta: {requiresAuth: true} },

  { path: '/todo', name: 'Todo', component: Todo, meta: {requiresAuth: true} },
  { path: '/todo/:id', name: 'TodoList', component: TodoList, meta: {requiresAuth: true} },
  
  { path: '/grocery', name: 'Grocery', component: Home, meta: {requiresAuth: true} },
  { path: '/grocery/:id', name: 'GroceryList', component: GroceryList, meta: {requiresAuth: true} },
  
  { path: '/recipe', name: 'Recipe', component: Recipe, meta: {requiresAuth: true} },
  { path: '/recipe/:id', name: 'RecipeDetail', component: RecipeDetail, meta: {requiresAuth: true} },
  
  { path: '/user', name: 'User', component: User, meta: {requiresAuth: true} },
  { path: '/user/contacts', name: 'Contacts', component: Contacts, meta: {requiresAuth: true} },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthService()

  // Attendre que la session soit chargée
  if (auth.loading.value) {
    await new Promise<void>(resolve => {
      const stop = watch(auth.loading, (val) => {
        if (!val) {
          stop()
          resolve()
        }
      })
    })
  }

  const isAuthenticated = !!auth.user.value
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'SignIn', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})


export default router
