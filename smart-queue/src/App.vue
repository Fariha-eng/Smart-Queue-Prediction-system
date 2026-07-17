<template>
  <div>
    <!-- NavBar is now a separate reusable component.
         Props go DOWN (userRole, userName), event goes UP (logout) -->
    <NavBar :user-role="userRole" :user-name="userName" @logout="logout" />

    <!-- Page Content -->
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'

const router = useRouter()

const userRole = ref(localStorage.getItem('userRole') || '')
const userName = ref(localStorage.getItem('userName') || '')

// Refresh navbar on every route change (after login/logout)
router.afterEach(() => {
  userRole.value = localStorage.getItem('userRole') || ''
  userName.value = localStorage.getItem('userName') || ''
})

function logout() {
  localStorage.removeItem('userRole')
  localStorage.removeItem('userName')
  userRole.value = ''
  userName.value = ''
  router.push('/login')
}
</script>

<style>
body {
  background-color: #f5f7fa;
}
</style>
