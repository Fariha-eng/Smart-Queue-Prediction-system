<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">Smart Queue System</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav ms-auto align-items-lg-center">

          <!-- Not logged in -->
          <template v-if="!userRole">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
          </template>

          <!-- Logged in as Patient -->
          <template v-else-if="userRole === 'patient'">
            <li class="nav-item">
              <router-link class="nav-link" to="/doctors">Doctors</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/queue-status">Queue Status</router-link>
            </li>
            <li class="nav-item ms-2">
              <span class="navbar-text text-white-50 small me-2">
                Hi, {{ userName }}
              </span>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm" @click="$emit('logout')">
                Logout
              </button>
            </li>
          </template>

          <!-- Logged in as Doctor -->
          <template v-else-if="userRole === 'doctor'">
            <li class="nav-item">
              <router-link class="nav-link" to="/doctor-dashboard">
                My Dashboard
              </router-link>
            </li>
            <li class="nav-item ms-2">
              <span class="navbar-text text-white-50 small me-2">
                {{ userName }}
              </span>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm" @click="$emit('logout')">
                Logout
              </button>
            </li>
          </template>

          <!-- Logged in as Admin -->
          <template v-else-if="userRole === 'admin'">
            <li class="nav-item">
              <router-link class="nav-link" to="/admin-dashboard">
                Admin Panel
              </router-link>
            </li>
            <li class="nav-item ms-2">
              <span class="navbar-text text-white-50 small me-2">
                {{ userName }}
              </span>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm" @click="$emit('logout')">
                Logout
              </button>
            </li>
          </template>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Props: data flowing DOWN from App.vue (parent) into NavBar (child)
defineProps({
  userRole: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  }
})

// Emits: event flowing UP from NavBar (child) to App.vue (parent)
defineEmits(['logout'])
</script>
