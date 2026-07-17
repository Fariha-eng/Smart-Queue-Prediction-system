<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body">
      <h5 class="card-title">{{ doctor.name }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ doctor.specialty }}</h6>
      <p class="card-text mb-1">
        <strong>Available:</strong> {{ doctor.availability }}
      </p>
      <p class="card-text mb-3">
        <strong>Current Token:</strong> {{ doctor.currentToken }}
      </p>

      <button class="btn btn-primary w-100" @click="$emit('book-token', doctor.id)">
        Book Token
      </button>
    </div>
  </div>
</template>

<script setup>
// Props: dynamic doctor data flows DOWN from DoctorList.vue (parent) into this card (child)
// Strict type safety via runtime validator on the object shape
defineProps({
  doctor: {
    type: Object,
    required: true,
    validator(value) {
      return (
        (typeof value.id === 'number' || typeof value.id === 'string') &&
        typeof value.name === 'string' &&
        typeof value.specialty === 'string' &&
        typeof value.availability === 'string' &&
        typeof value.currentToken === 'number'
      )
    }
  }
})

// Emits: "book-token" event flows UP to the parent when the button is clicked,
// carrying the doctor's id as payload
defineEmits(['book-token'])
</script>
