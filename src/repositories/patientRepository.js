const BASE_URL = 'https://yuanqfswhberkoevtmfr.supabase.co/rest/v1'
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ'

const headers = {
  'apikey': API_KEY,
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
}

export const patientRepository = {
  async getAll() {
    const response = await fetch(`${BASE_URL}/patients?select=*`, { headers })
    if (!response.ok) throw new Error('Erro ao buscar pacientes')
    return response.json()
  },

  async getById(patientId) {
    const patients = await this.getAll()
    return patients.find((p) => String(p.id) === String(patientId)) || null
  },

  async getDirectoryRows() {
    const patients = await this.getAll()
    return patients.map((patient) => ({
      ...patient,
      name: patient.full_name,
      phone: patient.phone_mobile,
      detailId: patient.id,
      insurance: 'Particular',
      city: 'Recife',
      state: 'PE',
      vip: false,
      lastVisitIso: null,
      lastVisit: 'Ainda nao houve atendimento',
      nextVisit: 'Nenhum atendimento agendado',
    }))
  },
}
