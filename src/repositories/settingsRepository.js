export const settingsRepository = {
  getIntegrations() {
    return [
      ['WhatsApp Business', 'Envio automatico de lembretes e confirmacoes', true, 'bg-emerald-500'],
      ['Google Calendar', 'Sincronizacao bidirecional de agenda', false, 'bg-blue-500'],
      ['Stripe / PagSeguro', 'Pagamentos online e links de cobranca', true, 'bg-violet-500'],
      ['CFM - Conselho Federal de Medicina', 'Validacao automatica de CRM', false, 'bg-amber-500'],
      ['ANS - Planos de Saude', 'Integracao com tabela TUSS e convenios', false, 'bg-rose-500'],
      ['API de IA Preditiva', 'Score de absenteismo e predicao de faltas', true, 'bg-[#3b82f6]'],
    ]
  },

  getSections() {
    return [
      { id: 'aparencia', label: 'Aparencia', description: 'Tema, cores e exibicao', icon: 'palette' },
      { id: 'notificacoes', label: 'Notificacoes', description: 'Alertas e lembretes', icon: 'bell' },
      { id: 'privacidade', label: 'Privacidade & LGPD', description: 'Dados e conformidade', icon: 'shield' },
      { id: 'conta', label: 'Conta & Perfil', description: 'Informacoes pessoais', icon: 'user' },
      { id: 'integracoes', label: 'Integracoes', description: 'APIs e sistemas externos', icon: 'globe' },
      { id: 'dados', label: 'Dados & Backup', description: 'Exportacao e backup', icon: 'database' },
    ]
  },
}
