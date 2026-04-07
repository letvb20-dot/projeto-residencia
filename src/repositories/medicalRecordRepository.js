export const medicalRecordRepository = {
  getRecordTypes() {
    return ['Consulta Retorno', 'Primeira Consulta', 'Exame', 'Avaliacao Pre-Op']
  },

  getInitialRecords() {
    return [
      { id: 'record-1', patient: 'Carlos Eduardo Santos', date: '27/03/2026', doctor: 'Dra. Ana Silva', type: 'Consulta Retorno', cid: 'I10 - Hipertensao', status: 'completo', summary: 'Paciente relata melhora com medicacao. PA: 130/85. Mantida conduta.' },
      { id: 'record-2', patient: 'Mariana Costa', date: '26/03/2026', doctor: 'Dra. Ana Silva', type: 'Exame', cid: 'Z01.7 - Exame laboratorial', status: 'completo', summary: 'Resultados de hemograma dentro da normalidade. Solicitar retorno em 6 meses.' },
      { id: 'record-3', patient: 'Joao Pedro Alves', date: '25/03/2026', doctor: 'Dr. Carlos Mendes', type: 'Primeira Consulta', cid: 'R10 - Dor abdominal', status: 'rascunho', summary: 'Queixa de dor abdominal ha 2 semanas. Solicitados exames complementares.' },
      { id: 'record-4', patient: 'Fernanda Lima', date: '24/03/2026', doctor: 'Dra. Ana Silva', type: 'Avaliacao Pre-Op', cid: 'K80 - Colelitiase', status: 'completo', summary: 'Apta para procedimento cirurgico. Exames pre-operatorios normais.' },
      { id: 'record-5', patient: 'Roberto Campos', date: '22/03/2026', doctor: 'Dr. Roberto Nunes', type: 'Consulta Retorno', cid: 'E11 - DM Tipo 2', status: 'completo', summary: 'HbA1c: 7.2%. Ajuste de metformina. Retorno em 3 meses.' },
    ]
  },
}
