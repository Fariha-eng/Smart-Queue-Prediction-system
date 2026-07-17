<template>
  <div>
    <div v-if="hasBooking">
      <p class="mb-2"><strong>Doctor:</strong> {{ booking.doctorName }}</p>

      <ul class="list-group mb-3">
        <li class="list-group-item d-flex justify-content-between">
          <span>Current Token Being Served</span>
          <strong>{{ currentToken }}</strong>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span>My Token</span>
          <strong>{{ myToken }}</strong>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span>People Ahead of Me</span>
          <strong>{{ peopleAhead }}</strong>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span>Estimated Waiting Time</span>
          <strong>{{ waitingTime }} minutes</strong>
        </li>
      </ul>

      <div v-if="peopleAhead <= 0" class="alert alert-success text-center">
        It's your turn now!
      </div>

      <button class="btn btn-outline-primary w-100" @click="$emit('refresh')">
        Refresh Status
      </button>
    </div>

    <div v-else class="text-center">
      <p>You haven't booked a token yet.</p>
      <router-link to="/doctors" class="btn btn-primary">
        Go Book a Token
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Props: all queue data flows DOWN from QueueStatus.vue (parent) into this card (child)
defineProps({
  hasBooking: {
    type: Boolean,
    default: false
  },
  booking: {
    type: Object,
    default: null
  },
  currentToken: {
    type: Number,
    default: 0
  },
  myToken: {
    type: Number,
    default: 0
  },
  peopleAhead: {
    type: Number,
    default: 0
  },
  waitingTime: {
    type: Number,
    default: 0
  }
})

// Emits: "refresh" flows UP so the parent can re-read localStorage
defineEmits(['refresh'])
</script>
