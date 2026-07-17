<template>
  <div class="card shadow-sm">
    <div class="card-body p-4 text-center">
      <h3 class="mb-4">Doctor Dashboard</h3>

      <p class="mb-1"><strong>Doctor:</strong> {{ doctorName }}</p>
      <p class="mb-4 text-muted">Manage your patient queue below</p>

      <div class="display-1 fw-bold text-primary mb-3">
        {{ currentToken }}
      </div>
      <p class="mb-4">Current Token Being Served</p>

      <button class="btn btn-success btn-lg" @click="$emit('next-patient')">
        Next Patient ➜
      </button>

      <div class="mt-4">
        <button class="btn btn-outline-secondary" @click="$emit('reset-queue')">
          Reset Queue
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props: doctorName and currentToken flow DOWN from DoctorDashboard.vue (parent)
defineProps({
  doctorName: {
    type: String,
    required: true
  },
  currentToken: {
    type: Number,
    required: true,
    validator: (value) => value >= 0
  }
})

// Emits: button clicks flow UP as events; the parent decides how to update state
// and persist it to localStorage
defineEmits(['next-patient', 'reset-queue'])
</script>
