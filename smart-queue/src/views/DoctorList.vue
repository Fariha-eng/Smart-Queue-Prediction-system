<template>
  <div>
    <h3 class="mb-4">Available Doctors</h3>

    <!-- Loading state jab tak backend se data na aa jaye -->
    <div v-if="loading" class="text-center text-muted py-5">
      Loading doctors...
    </div>

    <!-- Error state agar backend se connect na ho paye -->
    <div v-else-if="errorMsg" class="alert alert-danger">
      {{ errorMsg }}
    </div>

    <div v-else class="row g-4">
      <div class="col-md-4" v-for="doctor in doctors" :key="doctor.id">
        <!-- DoctorCard: reusable child component.
             "doctor" is passed down as a prop, "book-token" comes back up as an emit -->
        <DoctorCard :doctor="doctor" @book-token="goToBookToken" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DoctorCard from '../components/DoctorCard.vue'
import api from '../api/axios'

const router = useRouter()

const doctors  = ref([])
const loading  = ref(true)
const errorMsg = ref('')

// Page khulte hi backend se doctors ki asal list mangwao
onMounted(async () => {
  try {
    const response = await api.get('/doctors')

    // Backend "_id" bhejta hai (MongoDB ka id), DoctorCard component "id" expect karta hai
    // isliye har doctor object mein ek "id" field bhi add kar dete hain
    doctors.value = response.data.map((doctor) => ({
      ...doctor,
      id: doctor._id
    }))
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not load doctors. Please try again.'
  } finally {
    loading.value = false
  }
})

// Handles the "book-token" event emitted by DoctorCard
function goToBookToken(doctorId) {
  router.push({ path: '/book-token', query: { doctorId } })
}
</script>
