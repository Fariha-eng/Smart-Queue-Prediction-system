<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="text-center mb-4">Queue Status</h3>

          <div v-if="loading" class="text-center text-muted py-3">Loading...</div>

          <div v-else-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

          <!-- QueueStatusCard: reusable child component.
               All queue values are passed down as props, "refresh" comes back up as an emit -->
          <QueueStatusCard
            v-else
            :has-booking="hasBooking"
            :booking="booking"
            :current-token="currentToken"
            :my-token="myToken"
            :people-ahead="peopleAhead"
            :waiting-time="waitingTime"
            @refresh="refresh"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QueueStatusCard from '../components/QueueStatusCard.vue'
import api from '../api/axios'

const loading = ref(true)
const errorMsg = ref('')

const hasBooking = ref(false)
const booking = ref(null)
const currentToken = ref(0)
const myToken = ref(0)
const peopleAhead = ref(0)
const waitingTime = ref(0)

// Backend ka /tokens/my-status route ekdum wahi shape return karta hai jo hume chahiye
async function loadStatus() {
  loading.value = true
  errorMsg.value = ''

  try {
    const response = await api.get('/tokens/my-status')
    hasBooking.value = response.data.hasBooking

    if (response.data.hasBooking) {
      booking.value = { doctorName: response.data.doctorName }
      currentToken.value = response.data.currentToken
      myToken.value = response.data.myToken
      peopleAhead.value = response.data.peopleAhead
      waitingTime.value = response.data.waitingTime
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not load queue status.'
  } finally {
    loading.value = false
  }
}

onMounted(loadStatus)

// Handles the "refresh" event emitted by QueueStatusCard
function refresh() {
  loadStatus()
}
</script>