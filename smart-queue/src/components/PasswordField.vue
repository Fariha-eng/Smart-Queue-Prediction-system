<template>
  <div>
    <label class="form-label">Password</label>
    <div class="input-group">
      <input
        :type="showPassword ? 'text' : 'password'"
        :class="['form-control', modelValue && !isValid ? 'is-invalid' : modelValue && isValid ? 'is-valid' : '']"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        required
      />
      <button
        class="btn btn-outline-secondary"
        type="button"
        @click="showPassword = !showPassword"
      >
        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
      </button>
    </div>

    <!-- Password error rules -->
    <ul v-if="modelValue && !isValid" class="mt-2 ps-3 small text-danger mb-0">
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>

    <!-- Password strong message -->
    <p v-if="modelValue && isValid" class="text-success small mt-1 mb-0">
      Password is strong!
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props: flow DOWN from Login.vue / Register.vue (parent) into this field (child).
// modelValue + errors + isValid are computed by the parent so the same
// validation rules stay in one place, while this component only handles display.
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  errors: {
    type: Array,
    default: () => []
  },
  isValid: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Enter your password'
  }
})

// Emits: "update:modelValue" flows UP so v-model works on the parent's <PasswordField>
defineEmits(['update:modelValue'])

// Local UI-only state (show/hide password) — does not need to be a prop
const showPassword = ref(false)
</script>
