export const communicationRepository = {
  getCampaigns() {
    return [
      { title: 'Lembretes Anti-Falta', desc: 'Envio automatico 48h e 4h antes', count: '324 pacientes elegiveis' },
      { title: 'Vacinacao 2026', desc: 'Campanha de vacinacao anual', count: '156 pacientes elegiveis' },
      { title: 'Retorno Pendente', desc: 'Pacientes com retorno atrasado', count: '42 pacientes elegiveis' },
    ]
  },

  getInitialMessages() {
    return [
      { id: '1', patient: 'Carlos Eduardo Santos', channel: 'whatsapp', template: 'Lembrete 48h', sentAt: '25/03/2026 09:00', status: 'lida', response: 'Confirmado!' },
      { id: '2', patient: 'Mariana Costa', channel: 'whatsapp', template: 'Lembrete 48h', sentAt: '25/03/2026 09:05', status: 'entregue' },
      { id: '3', patient: 'Joao Pedro Alves', channel: 'whatsapp', template: 'Lembrete 4h', sentAt: '27/03/2026 05:00', status: 'pendente' },
      { id: '4', patient: 'Fernanda Lima', channel: 'email', template: 'Confirmacao de Agendamento', sentAt: '24/03/2026 15:30', status: 'lida' },
      { id: '5', patient: 'Roberto Campos', channel: 'whatsapp', template: 'Lembrete Extra (Risco Alto)', sentAt: '26/03/2026 10:00', status: 'entregue' },
      { id: '6', patient: 'Sandra Oliveira', channel: 'sms', template: 'Lembrete 48h', sentAt: '24/03/2026 08:00', status: 'falha' },
      { id: '7', patient: 'Lucia Ferreira', channel: 'email', template: 'Resultado de Exames', sentAt: '26/03/2026 14:00', status: 'lida' },
      { id: '8', patient: 'Paulo Ricardo', channel: 'whatsapp', template: 'Reagendamento Sugerido (IA)', sentAt: '27/03/2026 07:00', status: 'pendente' },
    ]
  },

  getInitialTemplates() {
    return [
      { id: 't1', name: 'Lembrete 48h', channel: 'whatsapp', content: 'Ola {nome}! Lembramos que sua consulta esta agendada para {data} as {hora}. Confirme respondendo SIM.', category: 'Lembrete' },
      { id: 't2', name: 'Lembrete 4h', channel: 'whatsapp', content: 'Ola {nome}! Sua consulta e hoje as {hora}. Estamos te esperando!', category: 'Lembrete' },
      { id: 't3', name: 'Lembrete Extra (Risco Alto)', channel: 'whatsapp', content: 'Ola {nome}! Notamos que sua presenca e muito importante. Podemos confirmar sua consulta de {data}?', category: 'IA' },
      { id: 't4', name: 'Confirmacao de Agendamento', channel: 'email', content: 'Prezado(a) {nome}, confirmamos seu agendamento para {data} as {hora} com {medico}.', category: 'Agendamento' },
      { id: 't5', name: 'Resultado de Exames', channel: 'email', content: 'Prezado(a) {nome}, seus resultados de exames estao disponiveis. Acesse o portal do paciente.', category: 'Exames' },
      { id: 't6', name: 'Reagendamento Sugerido (IA)', channel: 'whatsapp', content: 'Ola {nome}! Que tal reagendar sua consulta para um horario mais conveniente? Temos vagas em {sugestoes}.', category: 'IA' },
    ]
  },
}
