import { professionals as mockProfessionals } from '../data/mockData.js'

export const professionalRepository = {
  getAll() {
    return mockProfessionals
  },

  getCoverageMap() {
    return {
      slots: ['08-12', '09-13', '10-15', '13-18', '08-14'],
      weekdays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
    }
  },
}
