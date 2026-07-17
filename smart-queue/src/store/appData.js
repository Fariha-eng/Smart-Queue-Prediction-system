import { reactive, watch } from 'vue'

// Shared "fake backend" store — sab views (Admin, DoctorList, BookToken) isi se
// data lete hain, taake admin jo change kare wo har jagah reflect ho.
// Jab real backend/database aayega, to ye functions sirf API calls ban jayenge —
// components ko change karne ki zaroorat nahi hogi.

const DOCTORS_KEY = 'sq_doctors'
const PATIENTS_KEY = 'sq_patients'

function loadDoctors() {
  const saved = localStorage.getItem(DOCTORS_KEY)
  if (saved) return JSON.parse(saved)

  // Seed data — same doctors jo pehle DoctorList.vue mein hardcoded thay
  return [
    { id: 1, name: 'Dr. Ayesha Khan', specialty: 'Cardiologist', availability: 'Mon - Fri, 9 AM - 2 PM', currentToken: 12 },
    { id: 2, name: 'Dr. Ahmed', specialty: 'Dermatologist', availability: 'Mon - Sat, 11 AM - 4 PM', currentToken: 8 },
    { id: 3, name: 'Dr. Sara Malik', specialty: 'Pediatrician', availability: 'Tue - Sun, 10 AM - 3 PM', currentToken: 20 },
    { id: 4, name: 'Dr. Usman Tariq', specialty: 'Dentist', availability: 'Mon - Fri, 12 PM - 6 PM', currentToken: 5 }
  ]
}

function loadPatients() {
  const saved = localStorage.getItem(PATIENTS_KEY)
  return saved ? JSON.parse(saved) : []
}

export const store = reactive({
  doctors: loadDoctors(),
  patients: loadPatients()
})

// Har change ko localStorage mein persist karo (deep watch — arrays/objects ke andar changes bhi)
watch(
  () => store.doctors,
  (val) => localStorage.setItem(DOCTORS_KEY, JSON.stringify(val)),
  { deep: true }
)

watch(
  () => store.patients,
  (val) => localStorage.setItem(PATIENTS_KEY, JSON.stringify(val)),
  { deep: true }
)

// ---------- Doctor management (Admin uses these) ----------

export function addDoctor({ name, specialty, availability }) {
  const newId = store.doctors.length ? Math.max(...store.doctors.map((d) => d.id)) + 1 : 1
  store.doctors.push({ id: newId, name, specialty, availability, currentToken: 1 })
}

export function updateDoctor(id, updates) {
  const doctor = store.doctors.find((d) => d.id === id)
  if (doctor) Object.assign(doctor, updates)
}

export function deleteDoctor(id) {
  const idx = store.doctors.findIndex((d) => d.id === id)
  if (idx !== -1) store.doctors.splice(idx, 1)
}

export function resetDoctorQueue(id) {
  const doctor = store.doctors.find((d) => d.id === id)
  if (doctor) doctor.currentToken = 1
}

// ---------- Patient management (Admin uses these; Register.vue adds new patients) ----------

export function addPatient({ name, email, password }) {
  store.patients.push({
    id: Date.now(),
    name,
    email,
    password,
    registeredAt: new Date().toLocaleString()
  })
}

export function deletePatient(id) {
  const idx = store.patients.findIndex((p) => p.id === id)
  if (idx !== -1) store.patients.splice(idx, 1)
}
