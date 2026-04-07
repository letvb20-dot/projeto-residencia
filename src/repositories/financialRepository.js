import { patientRepository } from './patientRepository.js'

const transactions = [
  { id: 'fin-1', patientId: 'ana-souza', patient: 'Carlos Eduardo Santos', service: 'Consulta Cardiologica', amount: 350, dueDate: '27/03/2026', method: 'Cartao Credito', status: 'pago' },
  { id: 'fin-2', patientId: 'bruno-lima', patient: 'Mariana Costa', service: 'Retorno - Exames', amount: 200, dueDate: '26/03/2026', method: 'Convenio', status: 'pago', insurance: 'Unimed' },
  { id: 'fin-3', patientId: 'carla-mendes', patient: 'Joao Pedro Alves', service: 'Primeira Consulta', amount: 400, dueDate: '30/03/2026', method: 'Boleto', status: 'pendente' },
  { id: 'fin-4', patientId: 'diego-alves', patient: 'Fernanda Lima', service: 'Avaliacao Cirurgica', amount: 600, dueDate: '24/03/2026', method: 'PIX', status: 'pago', discount: 50 },
  { id: 'fin-5', patientId: 'ana-souza', patient: 'Roberto Campos', service: 'Consulta Cardiologica', amount: 350, dueDate: '22/03/2026', method: 'Convenio', status: 'atrasado', insurance: 'Bradesco Saude' },
  { id: 'fin-6', patientId: 'bruno-lima', patient: 'Sandra Oliveira', service: 'Consulta Geral', amount: 250, dueDate: '20/03/2026', method: 'Dinheiro', status: 'pago' },
  { id: 'fin-7', patientId: 'carla-mendes', patient: 'Paulo Ricardo', service: 'Retorno Pos-Op', amount: 0, dueDate: '18/03/2026', method: 'Cortesia', status: 'cancelado' },
]

export const financialRepository = {
  getMonthlyData() {
    return [
      { month: 'Out', receita: 42000, despesa: 28000 },
      { month: 'Nov', receita: 48000, despesa: 30000 },
      { month: 'Dez', receita: 38000, despesa: 25000 },
      { month: 'Jan', receita: 52000, despesa: 32000 },
      { month: 'Fev', receita: 45000, despesa: 29000 },
      { month: 'Mar', receita: 56000, despesa: 33000 },
    ]
  },

  getPaymentMethods() {
    return [
      { name: 'Convenio', value: 40, color: '#3b82f6' },
      { name: 'PIX', value: 25, color: '#10b981' },
      { name: 'Cartao', value: 20, color: '#8b5cf6' },
      { name: 'Boleto', value: 10, color: '#f59e0b' },
      { name: 'Dinheiro', value: 5, color: '#6b7280' },
    ]
  },

  getTransactions() {
    return transactions.map((transaction) => ({
      ...transaction,
      patient: patientRepository.getById(transaction.patientId)?.name || transaction.patient,
    }))
  },
}
