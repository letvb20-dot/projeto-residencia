import { appointments as mockAppointments } from '../data/mockData.js'

export const appointmentRepository = {
  getAll() {
    return mockAppointments
  },

  getTodayTimeline() {
    return [
      { hour: '08:00', patient: 'Carla Mendes', type: 'Consulta inicial', status: 'Confirmada', patientId: 'carla-mendes' },
      { hour: '09:30', patient: 'Ana Souza', type: 'Retorno clinico', status: 'Em triagem', patientId: 'ana-souza' },
      { hour: '11:00', patient: 'Diego Alves', type: 'Acompanhamento', status: 'Aguardando', patientId: 'diego-alves' },
      { hour: '14:30', patient: 'Bruno Lima', type: 'Teleconsulta', status: 'Confirmada', patientId: 'bruno-lima' },
      { hour: '16:00', patient: 'Horario protegido', type: 'Revisao de laudos', status: 'Bloqueado', patientId: null },
    ]
  },

  getPredictiveQueueSummary() {
    return [
      { label: 'Alta prioridade', value: 3, tone: 'red' },
      { label: 'A confirmar', value: 5, tone: 'amber' },
      { label: 'Teleconsultas', value: 6, tone: 'blue' },
    ]
  },

  getWeekDays() {
    return [
      { label: 'Seg', day: '06', active: false, count: 6 },
      { label: 'Ter', day: '07', active: true, count: 18 },
      { label: 'Qua', day: '08', active: false, count: 12 },
      { label: 'Qui', day: '09', active: false, count: 9 },
      { label: 'Sex', day: '10', active: false, count: 15 },
    ]
  },
}
