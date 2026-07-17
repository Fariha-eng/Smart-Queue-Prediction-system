import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import DoctorList from '../views/DoctorList.vue'
import BookToken from '../views/BookToken.vue'
import QueueStatus from '../views/QueueStatus.vue'
import DoctorDashboard from '../views/DoctorDashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const routes = [
  { path: '/',                  redirect: '/login' },
  { path: '/login',             name: 'Login',           component: Login },
  { path: '/register',          name: 'Register',        component: Register },
  { path: '/doctors',           name: 'DoctorList',      component: DoctorList,      meta: { role: 'patient' } },
  { path: '/book-token',        name: 'BookToken',       component: BookToken,       meta: { role: 'patient' } },
  { path: '/queue-status',      name: 'QueueStatus',     component: QueueStatus,     meta: { role: 'patient' } },
  { path: '/doctor-dashboard',  name: 'DoctorDashboard', component: DoctorDashboard, meta: { role: 'doctor'  } },
  { path: '/admin-dashboard',   name: 'AdminDashboard',  component: AdminDashboard,  meta: { role: 'admin'   } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route Guard — wrong role ko block karo
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole')

  if (to.meta.role) {
    if (to.meta.role === 'doctor' && userRole !== 'doctor') {
      next('/login')
    } else if (to.meta.role === 'patient' && userRole !== 'patient') {
      next('/login')
    } else if (to.meta.role === 'admin' && userRole !== 'admin') {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
