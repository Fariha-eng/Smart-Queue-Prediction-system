<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-body p-4 text-center">
          <h3 class="mb-4">Book Token</h3>

          <!-- Loading state -->
          <div v-if="loading" class="text-muted py-3">Loading doctor info...</div>

          <div v-else>
            <p class="mb-1"><strong>Doctor:</strong> {{ doctorName }}</p>
            <p class="mb-4"><strong>Specialty:</strong> {{ doctorSpecialty }}</p>

            <!-- Error message (e.g. booking failed) -->
            <div v-if="errorMsg" class="alert alert-danger py-2">
              {{ errorMsg }}
            </div>

            <!-- Before booking -->
            <div v-if="!tokenGenerated">
              <button class="btn btn-success btn-lg" @click="bookToken" :disabled="booking">
                {{ booking ? 'Booking...' : 'Generate My Token' }}
              </button>
            </div>

            <!-- After booking -->
            <div v-else>
              <div class="alert alert-success">
                <h4 class="mb-0">Your Token Number: {{ myToken }}</h4>
              </div>
              <button class="btn btn-primary" @click="goToQueueStatus">
                View Queue Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios'

const route = useRoute()
const router = useRouter()

const doctorId = route.query.doctorId // ab ye MongoDB ka string id hai (number nahi)

const doctorName = ref('')
const doctorSpecialty = ref('')
const loading = ref(true)
const booking = ref(false)
const myToken = ref(0)
const tokenGenerated = ref(false)
const errorMsg = ref('')

// Doctor ki details backend se laao (list se hi doctorId match karke nikal lete hain,
// kyunke abhi "single doctor" ka alag route nahi hai)
onMounted(async () => {
  try {
    const response = await api.get('/doctors')
    const doctor = response.data.find((d) => d._id === doctorId) || response.data[0]

    doctorName.value = doctor.name
    doctorSpecialty.value = doctor.specialty
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not load doctor info.'
  } finally {
    loading.value = false
  }
})

async function bookToken() {
  errorMsg.value = ''
  booking.value = true

  try {
    // Backend hi token number calculate karke deta hai (queue mein sab se aage se number)
    const response = await api.post('/tokens/book', { doctorId })
    myToken.value = response.data.tokenNumber
    tokenGenerated.value = true
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Booking failed. Please try again.'
  } finally {
    booking.value = false
  }
}

function goToQueueStatus() {
  router.push('/queue-status')
}
</script>
