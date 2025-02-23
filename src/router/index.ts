import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'
import UsersView from '@/views/UsersView.vue'
import PersonsView from '@/views/PersonsView.vue'
import ContactsView from '@/views/ContactsView.vue'
import LoginView from '@/views/LoginView.vue'
import MyRegistrationView from '@/views/MyRegistrationView.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/contatos', name: 'Contatos', component: ContactsView, meta: { requiresAuth: true } },
  { path: '/pessoas', name: 'Pessoas', component: PersonsView, meta: { requiresAuth: true } },
  { path: '/usuarios', name: 'Usuários', component: UsersView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/meu-cadastro', name: 'Meu Cadastro', component: MyRegistrationView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, _, next) => {
  const auth = useAuthStore()

  if (!auth.user && auth.token) {
    await auth.initialize()
  }

  if (to.meta.requiresAuth && !auth.token) {
    next('/login')
  }

  else if (to.meta.requiresAdmin && !auth.isAdmin) {
    next('/')
  }

  else if (to.path === '/login' && auth.token) {
    next('/')
  }

  else {
    next()
  }
})

export default router
