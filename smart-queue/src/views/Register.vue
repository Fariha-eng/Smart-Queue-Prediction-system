<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="text-center mb-4">Register</h3>

          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input
                type="text"
                class="form-control"
                v-model="name"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                type="email"
                :class="['form-control', email && !isEmailValid ? 'is-invalid' : email && isEmailValid ? 'is-valid' : '']"
                v-model="email"
                placeholder="example@gmail.com"
                required
              />
              <div v-if="email && !isEmailValid" class="invalid-feedback">
                Please enter a valid email (e.g. user@gmail.com)
              </div>
            </div>

            <!-- PasswordField: the SAME reusable component used on the Login page.
                 Demonstrates props flowing down (v-model, errors, isValid)
                 and the update:modelValue emit flowing back up. -->
            <div class="mb-3">
              <PasswordField
                v-model="password"
                :errors="passwordErrors"
                :is-valid="isPasswordValid"
                :placeholder="'Enter password'"
              />
            </div>

            <!-- Error Message (e.g. email already registered) -->
            <div v-if="errorMsg" class="alert alert-danger py-2">
              {{ errorMsg }}
            </div>

            <button
              type="submit"
              class="btn btn-success w-100"
              :disabled="!isEmailValid || !isPasswordValid"
            >
              Register
            </button>
          </form>

          <p class="text-center mt-3 mb-0">
            Already have an account?
            <router-link to="/login">Login here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PasswordField from '../components/PasswordField.vue'
import api from '../api/axios'

const router = useRouter()

const name         = ref('')
const email        = ref('')
const password     = ref('')
const errorMsg     = ref('')

// Email validation
const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})

// Password validation
const passwordErrors = computed(() => {
  const errors = []
  if (password.value.length < 8)          errors.push('At least 8 characters')
  if (!/[A-Z]/.test(password.value))      errors.push('One uppercase letter (A-Z)')
  if (!/[a-z]/.test(password.value))      errors.push('One lowercase letter (a-z)')
  if (!/[0-9]/.test(password.value))      errors.push('One number (0-9)')
  if (!/[!@#$%^&*]/.test(password.value)) errors.push('One special character (!@#$%^&*)')
  return errors
})

const isPasswordValid = computed(() => passwordErrors.value.length === 0)

async function handleRegister() {
  if (!isEmailValid.value || !isPasswordValid.value) return

  errorMsg.value = ''

  try {
    // Backend ko request bhejo — wahi database mein naya patient save karega
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })

    alert('Registration successful! Please login now.')
    router.push('/login')
  } catch (err) {
    // Jaise: "This email is already registered."
    errorMsg.value = err.response?.data?.message || 'Registration failed. Please try again.'
  }
}
</script>
