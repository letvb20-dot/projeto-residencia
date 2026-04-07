import { patientRepository } from './patientRepository.js'

const fallbackTopPatients = [
  { id: 'ana-souza', name: 'Carlos Eduardo Santos', visits: 12, revenue: 4200 },
  { id: 'carla-mendes', name: 'Fernanda Lima', visits: 10, revenue: 6000 },
  { id: 'bruno-lima', name: 'Mariana Costa', visits: 8, revenue: 1600 },
  { id: 'roberto-campos', name: 'Roberto Campos', visits: 7, revenue: 2450 },
  { id: 'sandra-oliveira', name: 'Sandra Oliveira', visits: 6, revenue: 1500 },
]

export const analyticsRepository = {
  getDashboardData() {
    return {
      absenteeismData: [
        { month: 'Out', taxa: 18, meta: 15 },
        { month: 'Nov', taxa: 16, meta: 15 },
        { month: 'Dez', taxa: 22, meta: 15 },
        { month: 'Jan', taxa: 14, meta: 15 },
        { month: 'Fev', taxa: 12, meta: 15 },
        { month: 'Mar', taxa: 14.2, meta: 15 },
      ],
      consultationsData: [
        { month: 'Out', total: 380, realizadas: 312 },
        { month: 'Nov', total: 420, realizadas: 352 },
        { month: 'Dez', total: 350, realizadas: 273 },
        { month: 'Jan', total: 450, realizadas: 387 },
        { month: 'Fev', total: 400, realizadas: 352 },
        { month: 'Mar', total: 460, realizadas: 395 },
      ],
      doctorPerformance: [
        { name: 'Dra. Ana Silva', consultas: 185, noShow: 12, satisfacao: 4.8 },
        { name: 'Dr. Carlos Mendes', consultas: 142, noShow: 18, satisfacao: 4.6 },
        { name: 'Dr. Roberto Nunes', consultas: 128, noShow: 22, satisfacao: 4.4 },
      ],
      insuranceData: [
        { name: 'Particular', value: 35, color: '#3b82f6' },
        { name: 'Unimed', value: 28, color: '#10b981' },
        { name: 'Bradesco', value: 18, color: '#8b5cf6' },
        { name: 'Amil', value: 12, color: '#f59e0b' },
        { name: 'SUS', value: 7, color: '#ef4444' },
      ],
      kpis: [
        { label: 'Consultas Realizadas', value: '395', change: '+12%', up: true, icon: 'calendar' },
        { label: 'Taxa de No-Show', value: '14.2%', change: '-3.1%', up: false, icon: 'activity' },
        { label: 'Faturamento', value: 'R$ 56K', change: '+24%', up: true, icon: 'dollar' },
        { label: 'Pacientes Ativos', value: '1.247', change: '+8%', up: true, icon: 'users' },
      ],
      revenueData: [
        { month: 'Out', valor: 42000 },
        { month: 'Nov', valor: 48000 },
        { month: 'Dez', valor: 38000 },
        { month: 'Jan', valor: 52000 },
        { month: 'Fev', valor: 45000 },
        { month: 'Mar', valor: 56000 },
      ],
      topPatients: fallbackTopPatients.map((patient) => ({
        ...patient,
        name: patientRepository.getById(patient.id)?.name || patient.name,
      })),
    }
  },
}
