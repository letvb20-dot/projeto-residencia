export const homeRepository = {
  getDashboardOverview() {
    return {
      appointmentsToday: [
        { time: '09:00', name: 'Ana Souza', patientId: 'ana-souza', status: 'Risco moderado' },
        { time: '10:30', name: 'Bruno Lima', patientId: 'bruno-lima', status: 'Alta prioridade' },
        { time: '14:00', name: 'Carla Mendes', patientId: 'carla-mendes', status: 'Confirmada' },
      ],
      metrics: [
        { label: 'Consultas Hoje', value: '42', change: '+12%', tone: 'blue' },
        { label: 'Taxa de Ocupacao', value: '14.2%', change: '+8%', tone: 'violet' },
        { label: 'No-show', value: '35', change: '-3%', tone: 'green' },
      ],
      reportCards: [
        { title: 'Proximos Pacientes', description: 'Agenda de hoje e status preditivo', icon: 'calendar' },
        { title: 'Pacientes Frequentes', description: 'Mais atendidos neste mes', icon: 'users' },
        { title: 'Produtividade Medica', description: 'Consultas realizadas e avaliacoes', icon: 'brand' },
        { title: 'Analise de Convenios', description: 'Distribuicao de atendimentos', icon: 'building' },
      ],
    }
  },
}
