<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

      <!-- TokenCounter: reusable child component.
           doctorName/currentToken are passed down as props,
           next-patient/reset-queue come back up as emits -->
      <TokenCounter
        :doctor-name="doctorName"
        :current-token="currentToken"
        @next-patient="nextPatient"
        @reset-queue="resetQueue"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TokenCounter from '../components/TokenCounter.vue'
import api from '../api/axios'

// Login ke waqt Login.vue ne ye save kiya tha
const doctorId = localStorage.getItem('userId')

const doctorName = ref('')
const currentToken = ref(1)
const errorMsg = ref('')

// Doctor ki apni info (name + currentToken) backend se laao
// (abhi "single doctor" ka alag route nahi hai, isliye pori list se apna wala dhoond lete hain)
onMounted(async () => {
  try {
    const response = await api.get('/doctors')
    const doctor = response.data.find((d) => d._id === doctorId)

    if (doctor) {
      doctorName.value = doctor.name
      currentToken.value = doctor.currentToken
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not load your info.'
  }
})

// Handles the "next-patient" event emitted by TokenCounter
async function nextPatient() {
  errorMsg.value = ''
  try {
    const response = await api.put(`/doctors/${doctorId}/next-patient`)
    currentToken.value = response.data.currentToken
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not update token.'
  }
}

// Handles the "reset-queue" event emitted by TokenCounter
async function resetQueue() {
  errorMsg.value = ''
  try {
    const response = await api.put(`/doctors/${doctorId}/reset-queue`)
    currentToken.value = response.data.currentToken
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not reset queue.'
  }
}
</script>