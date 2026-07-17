<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="text-center mb-4">Login</h3>

          <!-- Role Selector -->
          <div class="mb-3">
            <label class="form-label fw-bold">Login as:</label>
            <div class="d-flex gap-4">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  value="patient"
                  v-model="role"
                  id="rolePatient"
                />
                <label class="form-check-label" for="rolePatient">Patient</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  value="doctor"
                  v-model="role"
                  id="roleDoctor"
                />
                <label class="form-check-label" for="roleDoctor">Doctor</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  value="admin"
                  v-model="role"
                  id="roleAdmin"
                />
                <label class="form-check-label" for="roleAdmin">Admin</label>
              </div>
            </div>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin">

            <!-- Email Field -->
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                type="email"
                :class="['form-control', email && !isEmailValid ? 'is-invalid' : email && isEmailValid ? 'is-valid' : '']"
                v-model="email"
                :placeholder="role === 'doctor' || role === 'admin' ? 'example@clinic.com' : 'example@gmail.com'"
                required
              />
              <div v-if="email && !isEmailValid" class="invalid-feedback">
                Please enter a valid email
              </div>
              <div v-if="email && isEmailValid" class="valid-feedback">
                 Email looks correct!
              </div>
            </div>

            <!-- Password Field: reusable child component.
                 v-model + validation results are passed down as props,
                 typed input flows back up via the update:modelValue emit -->
            <div class="mb-3">
              <PasswordField
                v-model="password"
                :errors="passwordErrors"
                :is-valid="isPasswordValid"
                :placeholder="'Enter your password'"
              />
            </div>

            <!-- Error Message (wrong credentials) -->
            <div v-if="errorMsg" class="alert alert-danger py-2">
              {{ errorMsg }}
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="!isEmailValid || !isPasswordValid"
            >
              Login
            </button>

          </form>

          <!-- Register link only for patient -->
          <p v-if="role === 'patient'" class="text-center mt-3 mb-0">
            Don't have an account?
            <router-link to="/register">Register here</router-link>
          </p>

          <!-- Doctor note -->
          <p v-if="role === 'doctor'" class="text-center mt-3 mb-0 text-muted small">
            Doctor accounts are created by admin only.
          </p>

          <!-- Admin note -->
          <p v-if="role === 'admin'" class="text-center mt-3 mb-0 text-muted small">
            Admin login is restricted to authorized staff only.
          </p>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'  // ← watch add karo import mein

import { useRouter } from 'vue-router'
import PasswordField from '../components/PasswordField.vue'
import api from '../api/axios'

const router = useRouter()

const role         = ref('patient')
const email        = ref('')
const password     = ref('')
const errorMsg     = ref('')

// Email validation — dono k liye same
const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})

// Password rules — dono k liye same
const passwordErrors = computed(() => {
  const errors = []
  if (password.value.length < 8)          errors.push('At least 8 characters required')
  if (!/[A-Z]/.test(password.value))      errors.push('At least one uppercase letter (A-Z)')
  if (!/[a-z]/.test(password.value))      errors.push('At least one lowercase letter (a-z)')
  if (!/[0-9]/.test(password.value))      errors.push('At least one number (0-9)')
  if (!/[!@#$%^&*]/.test(password.value)) errors.push('At least one special character (!@#$%^&*)')
  return errors
})

// Password valid — dono k liye same rules
const isPasswordValid = computed(() => {
  return passwordErrors.value.length === 0
})
watch(role, () => {
  email.value    = ''
  password.value = ''
  errorMsg.value = ''
})
async function handleLogin() {
  errorMsg.value = ''

  try {
    // role.value already 'patient', 'doctor', ya 'admin' hai (radio button se)
    // Isliye URL khud ban jata hai: /auth/login/patient, /auth/login/doctor, /auth/login/admin
    const response = await api.post(`/auth/login/${role.value}`, {
      email: email.value,
      password: password.value
    })

    const { token, user } = response.data

    // Backend se mile token aur user info ko localStorage mein save karo
    localStorage.setItem('authToken', token)
    localStorage.setItem('userRole', user.role)
    localStorage.setItem('userName', user.name || user.email)
    localStorage.setItem('userId', user.id)

    // Role ke hisaab se sahi page pe bhej do
    if (user.role === 'doctor') {
      router.push('/doctor-dashboard')
    } else if (user.role === 'admin') {
      router.push('/admin-dashboard')
    } else {
      router.push('/doctors')
    }
  } catch (err) {
    // Backend jo error message bhejta hai wahi user ko dikhao
    errorMsg.value = err.response?.data?.message || 'Login failed. Please try again.'
  }
}
</script>
