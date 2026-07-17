<template>
  <div>
    <h3 class="mb-4">Admin Dashboard</h3>

    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <!-- Overview stat cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card shadow-sm text-center">
          <div class="card-body">
            <h6 class="text-muted mb-2">Total Doctors</h6>
            <div class="display-6 fw-bold text-primary">{{ stats.totalDoctors }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm text-center">
          <div class="card-body">
            <h6 class="text-muted mb-2">Total Patients</h6>
            <div class="display-6 fw-bold text-success">{{ stats.totalPatients }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm text-center">
          <div class="card-body">
            <h6 class="text-muted mb-2">Tokens In Queue (all doctors)</h6>
            <div class="display-6 fw-bold text-warning">{{ stats.totalTokensInQueue }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'doctors' }"
          @click="activeTab = 'doctors'"
        >
          Manage Doctors
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'patients' }"
          @click="activeTab = 'patients'"
        >
          Manage Patients
        </button>
      </li>
    </ul>

    <!-- ===================== DOCTORS TAB ===================== -->
    <div v-if="activeTab === 'doctors'">
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-success btn-sm" @click="openAddDoctorForm">
          + Add Doctor
        </button>
      </div>

      <!-- Add / Edit doctor form -->
      <div v-if="showDoctorForm" class="card shadow-sm mb-3">
        <div class="card-body">
          <h6 class="mb-3">{{ editingDoctorId ? 'Edit Doctor' : 'Add New Doctor' }}</h6>
          <form @submit.prevent="saveDoctor">
            <div class="row g-2">
              <div class="col-md-4">
                <label class="form-label small">Name</label>
                <input v-model="doctorForm.name" type="text" class="form-control" required />
              </div>

              <!-- Email/Password only needed when ADDING a new doctor (backend requires them) -->
              <div class="col-md-4" v-if="!editingDoctorId">
                <label class="form-label small">Email</label>
                <input v-model="doctorForm.email" type="email" class="form-control" required />
              </div>
              <div class="col-md-4" v-if="!editingDoctorId">
                <label class="form-label small">Password</label>
                <input v-model="doctorForm.password" type="password" class="form-control" required />
              </div>

              <div class="col-md-4">
                <label class="form-label small">Specialty</label>
                <input v-model="doctorForm.specialty" type="text" class="form-control" required />
              </div>
              <div class="col-md-4">
                <label class="form-label small">Availability</label>
                <input v-model="doctorForm.availability" type="text" class="form-control" required />
              </div>
            </div>
            <div class="mt-3">
              <button type="submit" class="btn btn-primary btn-sm me-2">
                {{ editingDoctorId ? 'Update' : 'Add' }}
              </button>
              <button type="button" class="btn btn-outline-secondary btn-sm" @click="cancelDoctorForm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Doctors table -->
      <div class="table-responsive">
        <table class="table table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Availability</th>
              <th>Current Token</th>
              <th style="width: 260px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doctor in doctors" :key="doctor._id">
              <td>{{ doctor.name }}</td>
              <td>{{ doctor.specialty }}</td>
              <td>{{ doctor.availability }}</td>
              <td>{{ doctor.currentToken }}</td>
              <td>
                <button class="btn btn-outline-primary btn-sm me-1" @click="editDoctor(doctor)">
                  Edit
                </button>
                <button class="btn btn-outline-warning btn-sm me-1" @click="resetDoctorQueue(doctor._id)">
                  Reset Queue
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="confirmDeleteDoctor(doctor._id)">
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="doctors.length === 0">
              <td colspan="5" class="text-center text-muted py-3">No doctors added yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===================== PATIENTS TAB ===================== -->
    <div v-if="activeTab === 'patients'">
      <div class="table-responsive">
        <table class="table table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registered At</th>
              <th style="width: 120px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="patient in patients" :key="patient._id">
              <td>{{ patient.name }}</td>
              <td>{{ patient.email }}</td>
              <td>{{ new Date(patient.createdAt).toLocaleString() }}</td>
              <td>
                <button class="btn btn-outline-danger btn-sm" @click="confirmDeletePatient(patient._id)">
                  Remove
                </button>
              </td>
            </tr>
            <tr v-if="patients.length === 0">
              <td colspan="4" class="text-center text-muted py-3">
                No patients registered yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'

const activeTab = ref('doctors')
const errorMsg = ref('')

const doctors = ref([])
const patients = ref([])
const stats = ref({ totalDoctors: 0, totalPatients: 0, totalTokensInQueue: 0, totalBookingsToday: 0 })

// ---------- Load everything on mount ----------
onMounted(async () => {
  await Promise.all([loadDoctors(), loadPatients(), loadStats()])
})

async function loadDoctors() {
  try {
    const response = await api.get('/doctors')
    doctors.value = response.data
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not load doctors.'
  }
}

async function loadPatients() {
  try {
    const response = await api.get('/admin/patients')
    patients.value = response.data
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not load patients.'
  }
}

async function loadStats() {
  try {
    const response = await api.get('/admin/stats')
    stats.value = response.data
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not load stats.'
  }
}

// ---------- Doctor form (add / edit shared) ----------
const showDoctorForm = ref(false)
const editingDoctorId = ref(null)
const doctorForm = ref({ name: '', email: '', password: '', specialty: '', availability: '' })

function openAddDoctorForm() {
  editingDoctorId.value = null
  doctorForm.value = { name: '', email: '', password: '', specialty: '', availability: '' }
  showDoctorForm.value = true
}

function editDoctor(doctor) {
  editingDoctorId.value = doctor._id
  doctorForm.value = {
    name: doctor.name,
    email: '',
    password: '',
    specialty: doctor.specialty,
    availability: doctor.availability
  }
  showDoctorForm.value = true
}

async function saveDoctor() {
  errorMsg.value = ''
  try {
    if (editingDoctorId.value) {
      // Update — sirf name/specialty/availability backend accept karta hai
      await api.put(`/doctors/${editingDoctorId.value}`, {
        name: doctorForm.value.name,
        specialty: doctorForm.value.specialty,
        availability: doctorForm.value.availability
      })
    } else {
      // Add — email/password bhi chahiye
      await api.post('/doctors', { ...doctorForm.value })
    }
    await loadDoctors()
    await loadStats()
    cancelDoctorForm()
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not save doctor.'
  }
}

function cancelDoctorForm() {
  showDoctorForm.value = false
  editingDoctorId.value = null
  doctorForm.value = { name: '', email: '', password: '', specialty: '', availability: '' }
}

async function confirmDeleteDoctor(id) {
  if (!confirm('Are you sure you want to delete this doctor?')) return
  try {
    await api.delete(`/doctors/${id}`)
    await loadDoctors()
    await loadStats()
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not delete doctor.'
  }
}

async function resetDoctorQueue(id) {
  try {
    await api.put(`/doctors/${id}/reset-queue`)
    await loadDoctors()
    await loadStats()
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not reset queue.'
  }
}

// ---------- Patients ----------
async function confirmDeletePatient(id) {
  if (!confirm('Are you sure you want to remove this patient?')) return
  try {
    await api.delete(`/admin/patients/${id}`)
    await loadPatients()
    await loadStats()
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Could not remove patient.'
  }
}
</script>