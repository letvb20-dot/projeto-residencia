import { patients as mockPatients } from '../data/mockData.js'

const patientCities = ['Recife', 'Olinda', 'Jaboatao', 'Recife']
const patientBirthdays = ['07/04', '18/04', '02/05', '24/04']
const patientLastVisitIso = ['2026-03-31', '2026-04-02', null, '2026-04-05']

export const patientRepository = {
  getAll() {
    return mockPatients
  },

  getById(patientId) {
    return mockPatients.find((patient) => patient.id === patientId) || null
  },

  getDirectoryRows() {
    return mockPatients.map((patient, index) => {
      const cpf = patient.document?.replace('CPF ', '') || ''

      return {
        ...patient,
        birthday: patientBirthdays[index] || '07/04',
        city: patientCities[index] || 'Recife',
        cpf,
        detailId: patient.id,
        insurance: normalizeInsurance(patient.plan),
        lastVisitIso: patientLastVisitIso[index] || null,
        state: 'PE',
        vip: index === 0,
      }
    })
  },
}

function normalizeInsurance(plan) {
  if (plan === 'Bradesco Saude') {
    return 'Bradesco Saude'
  }

  return plan || 'Particular'
}
