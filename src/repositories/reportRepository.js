const reportTypes = [
  'Atestado Medico',
  'Laudo de Exame',
  'Laudo de Imagem',
  'Relatorio Cirurgico',
  'Declaracao de Acompanhante',
  'Encaminhamento',
]

const doctors = ['Dra. Ana Silva', 'Dr. Carlos Mendes', 'Dr. Roberto Nunes']
const currentUser = 'Dra. Ana Silva'
const adminUsers = ['Dr. Roberto Nunes']

export const reportRepository = {
  getAdminUsers() {
    return adminUsers
  },

  getCurrentUser() {
    return currentUser
  },

  getDoctors() {
    return doctors
  },

  getInitialReports() {
    return [
      {
        id: 'report-1',
        type: 'Atestado Medico',
        patient: 'Carlos Eduardo Santos',
        doctor: 'Dra. Ana Silva',
        date: '27/03/2026',
        status: 'finalizado',
        content: 'Atesto que o paciente esteve em consulta medica nesta data, necessitando de repouso por 2 dias.',
        showDate: true,
        signDigital: true,
        versions: [
          { version: 1, action: 'Criado', user: 'Dra. Ana Silva', summary: 'Laudo criado' },
          { version: 2, action: 'Editado', user: 'Dra. Ana Silva', summary: 'Ajuste no periodo de repouso' },
          { version: 3, action: 'Liberado', user: 'Dra. Ana Silva', summary: 'Laudo liberado e finalizado' },
        ],
      },
      {
        id: 'report-2',
        type: 'Laudo de Exame',
        patient: 'Mariana Costa',
        doctor: 'Dra. Ana Silva',
        date: '26/03/2026',
        status: 'enviado',
        content: 'Laudo referente ao exame de ecocardiograma. Resultado dentro dos parametros normais.',
        showDate: true,
        signDigital: true,
        versions: [
          { version: 1, action: 'Criado', user: 'Dr. Carlos Mendes', summary: 'Laudo criado' },
          { version: 2, action: 'Editado', user: 'Dra. Ana Silva', summary: 'Adicao da data do exame' },
          { version: 3, action: 'Liberado', user: 'Dra. Ana Silva', summary: 'Conclusao incluida' },
          { version: 4, action: 'Enviado', user: 'Dr. Roberto Nunes', summary: 'Laudo enviado ao paciente' },
        ],
      },
      {
        id: 'report-3',
        type: 'Relatorio Cirurgico',
        patient: 'Fernanda Lima',
        doctor: 'Dr. Carlos Mendes',
        date: '25/03/2026',
        status: 'rascunho',
        content: 'Relatorio do procedimento de colecistectomia laparoscopica realizado sob anestesia geral.',
        showDate: false,
        signDigital: true,
        versions: [
          { version: 1, action: 'Criado', user: 'Dr. Carlos Mendes', summary: 'Relatorio criado' },
          { version: 2, action: 'Rascunho', user: 'Dr. Carlos Mendes', summary: 'Detalhamento do procedimento' },
        ],
      },
      {
        id: 'report-4',
        type: 'Declaracao de Acompanhante',
        patient: 'Joao Pedro Alves',
        doctor: 'Dr. Roberto Nunes',
        date: '24/03/2026',
        status: 'finalizado',
        content: 'Declaro que o acompanhante esteve presente durante todo o periodo de internacao.',
        showDate: true,
        signDigital: false,
        versions: [
          { version: 1, action: 'Criado', user: 'Dr. Roberto Nunes', summary: 'Declaracao criada e liberada' },
        ],
      },
      {
        id: 'report-5',
        type: 'Laudo de Imagem',
        patient: 'Roberto Campos',
        doctor: 'Dra. Ana Silva',
        date: '22/03/2026',
        status: 'enviado',
        content: 'Ultrassonografia de abdomen total sem achados patologicos relevantes.',
        showDate: true,
        signDigital: true,
        versions: [
          { version: 1, action: 'Criado', user: 'Dra. Ana Silva', summary: 'Laudo criado' },
          { version: 2, action: 'Liberado', user: 'Dra. Ana Silva', summary: 'Conclusao adicionada' },
          { version: 3, action: 'Enviado', user: 'Dr. Roberto Nunes', summary: 'Laudo enviado ao paciente' },
        ],
      },
    ]
  },

  getReportTypes() {
    return reportTypes
  },

  getTemplates() {
    return [
      { id: 'template-1', name: 'Atestado de Repouso Simples', type: 'Atestado Medico', description: 'Atestado padrao concedendo dias de repouso ao paciente.', content: 'Atesto, para os devidos fins, que o(a) paciente necessita de repouso pelo periodo indicado.' },
      { id: 'template-2', name: 'Laudo de Hemograma', type: 'Laudo de Exame', description: 'Resultado de hemograma completo com interpretacao clinica.', content: 'Laudo de hemograma completo com parametros avaliados e interpretacao clinica.' },
      { id: 'template-3', name: 'Relatorio Cirurgico', type: 'Relatorio Cirurgico', description: 'Relatorio padronizado para procedimento cirurgico.', content: 'Relatorio do procedimento cirurgico, achados, conduta e evolucao imediata.' },
    ]
  },
}
