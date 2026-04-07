import { useMemo, useState } from 'react'

import { financialRepository } from '../repositories/financialRepository.js'


const statusStyles = {
  pago: 'bg-emerald-500/20 text-emerald-400',
  pendente: 'bg-amber-500/20 text-amber-400',
  atrasado: 'bg-red-500/20 text-red-400',
  cancelado: 'bg-gray-500/20 text-gray-400',
}

const statusLabels = {
  pago: 'Pago',
  pendente: 'Pendente',
  atrasado: 'Atrasado',
  cancelado: 'Cancelado',
}

const cardClass = 'rounded-2xl border border-[#404040] bg-[#262626] shadow-sm'
const inputClass =
  'h-10 rounded-sm border border-[#404040] bg-[#171717] px-3 text-sm text-[#e5e5e5] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20'

export function FinancialPage() {
  const monthlyData = financialRepository.getMonthlyData()
  const paymentMethods = financialRepository.getPaymentMethods()
  const transactions = useMemo(() => financialRepository.getTransactions(), [])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const rows = useMemo(
    () =>
      transactions.filter((transaction) => {
          const matchesSearch = !search || transaction.patient.toLowerCase().includes(search.toLowerCase())
          const matchesStatus = !filterStatus || transaction.status === filterStatus

          return matchesSearch && matchesStatus
        }),
    [filterStatus, search, transactions],
  )

  const totals = useMemo(
    () => ({
      received: transactions.filter((item) => item.status === 'pago').reduce((sum, item) => sum + item.amount, 0),
      pending: transactions.filter((item) => item.status === 'pendente').reduce((sum, item) => sum + item.amount, 0),
      overdue: transactions.filter((item) => item.status === 'atrasado').reduce((sum, item) => sum + item.amount, 0),
      paidCount: transactions.filter((item) => item.status === 'pago').length,
      pendingCount: transactions.filter((item) => item.status === 'pendente').length,
      overdueCount: transactions.filter((item) => item.status === 'atrasado').length,
    }),
    [transactions],
  )

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">Financeiro</h1>
          <p className="mt-1 text-sm text-[#b8b8b8]">Controle de pagamentos, faturamento e fluxo de caixa</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4" aria-label="Resumo financeiro">
        <FinancialStat icon="trend" label="Faturamento Mensal" note="24.4% vs mês anterior" value={formatCurrency(56000)} />
        <FinancialStat icon="check" label="Recebido" note={`${totals.paidCount} pagamentos`} tone="green" value={formatCurrency(totals.received)} />
        <FinancialStat icon="clock" label="Pendente" note={`${totals.pendingCount} a vencer`} tone="amber" value={formatCurrency(totals.pending)} />
        <FinancialStat icon="alert" label="Inadimplência" note={`${totals.overdueCount} em atraso`} tone="red" value={formatCurrency(totals.overdue)} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3" aria-label="Gráficos financeiros">
        <article className={`${cardClass} p-6 lg:col-span-2`}>
          <h2 className="text-sm font-bold text-[#f5f5f5]">Receita x Despesa (últimos 6 meses)</h2>
          <div className="mt-4">
            <FinanceBarChart data={monthlyData} />
          </div>
        </article>

        <article className={`${cardClass} p-6`}>
          <h2 className="text-sm font-bold text-[#f5f5f5]">Formas de Pagamento</h2>
          <div className="mt-4">
            <PaymentDonut paymentMethods={paymentMethods} />
          </div>
        </article>
      </section>

      <section className={`${cardClass} p-6`} aria-label="Lançamentos financeiros">
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Buscar por paciente</span>
            <FinancialIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a3a3a3]" name="search" />
            <input
              className={`${inputClass} w-full pl-10`}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por paciente..."
              value={search}
            />
          </label>
          <select className={`${inputClass} min-w-48`} onChange={(event) => setFilterStatus(event.target.value)} value={filterStatus}>
            <option value="">Todos os Status</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
            <option value="atrasado">Atrasado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-sm border border-[#404040]">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#171717] text-xs font-semibold uppercase tracking-[0.02em] text-[#b8b8b8]">
              <tr>
                <th className="px-4 py-3">Paciente</th>
                <th className="px-4 py-3">Serviço</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Pagamento</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#404040] bg-[#262626]">
              {rows.map((transaction) => (
                <tr className="transition hover:bg-[#303030]" key={transaction.id}>
                  <td className="px-4 py-3 font-semibold text-[#f5f5f5]">{transaction.patient}</td>
                  <td className="px-4 py-3 text-[#b8b8b8]">{transaction.service}</td>
                  <td className="px-4 py-3 font-semibold text-[#e5e5e5]">
                    {formatCurrency(transaction.amount)}
                    {transaction.discount ? (
                      <span className="ml-1 text-[10px] text-emerald-400">(-{formatCurrency(transaction.discount)})</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-[#b8b8b8]">
                    {transaction.method}
                    {transaction.insurance ? <span className="ml-1 text-[10px] text-[#3b82f6]">({transaction.insurance})</span> : null}
                  </td>
                  <td className="px-4 py-3 text-[#b8b8b8]">{transaction.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-1 text-[10px] font-bold ${statusStyles[transaction.status]}`}>
                      {statusLabels[transaction.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function FinancialStat({ icon, label, note, tone = 'default', value }) {
  const toneClass = tone === 'green' ? 'text-emerald-400' : tone === 'amber' ? 'text-amber-400' : tone === 'red' ? 'text-red-400' : 'text-[#f5f5f5]'

  return (
    <article className={`${cardClass} p-5`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-medium text-[#a3a3a3]">{label}</p>
        <FinancialIcon className={`size-4 ${tone === 'default' ? 'text-emerald-400' : toneClass}`} name={icon} />
      </div>
      <p className={`mt-2 text-2xl font-bold leading-none ${toneClass}`}>{value}</p>
      <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#a3a3a3]">
        {tone === 'default' ? <FinancialIcon className="size-3.5 text-emerald-500" name="arrow-up" /> : null}
        {note}
      </span>
    </article>
  )
}

function FinanceBarChart({ data }) {
  return (
    <svg className="h-[280px] w-full overflow-visible" role="img" viewBox="0 0 760 320">
      {[0, 1, 2, 3, 4].map((index) => {
        const y = 30 + index * 58
        return <line key={index} stroke="#1e3a5f" strokeDasharray="3 5" x1="42" x2="730" y1={y} y2={y} />
      })}
      {data.map((item, index) => {
        const x = 70 + index * 108
        const receita = (item.receita / 60000) * 230
        const despesa = (item.despesa / 60000) * 230

        return (
          <g key={item.month}>
            <rect fill="#3b82f6" height={receita} rx="5" width="34" x={x} y={270 - receita} />
            <rect fill="#475569" height={despesa} rx="5" width="34" x={x + 42} y={270 - despesa} />
            <text className="fill-[#94a3b8] text-[13px]" textAnchor="middle" x={x + 38} y="304">
              {item.month}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function PaymentDonut({ paymentMethods }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const segments = paymentMethods.reduce((items, item) => {
    const dash = (item.value / 100) * circumference
    const previous = items.at(-1)
    const offset = previous ? previous.offset + previous.dash + 4 : 0
    return [...items, { ...item, dash, offset }]
  }, [])

  return (
    <div>
      <div className="flex justify-center">
        <svg className="h-[200px] w-[200px]" viewBox="0 0 120 120">
          <circle cx="60" cy="60" fill="none" r={radius} stroke="#303030" strokeWidth="18" />
          {segments.map((item) => (
            <circle
              cx="60"
              cy="60"
              fill="none"
              key={item.name}
              r={radius}
              stroke={item.color}
              strokeDasharray={`${item.dash} ${circumference - item.dash}`}
              strokeDashoffset={-item.offset}
              strokeLinecap="round"
              strokeWidth="18"
              transform="rotate(-90 60 60)"
            />
          ))}
          <circle cx="60" cy="60" fill="#262626" r="25" />
        </svg>
      </div>

      <div className="mt-2 space-y-2">
        {paymentMethods.map((method) => (
          <div className="flex items-center justify-between text-xs" key={method.name}>
            <span className="flex items-center gap-2 text-[#e5e5e5]">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: method.color }} />
              {method.name}
            </span>
            <span className="text-[#a3a3a3]">{method.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function FinancialIcon({ className = 'size-4', name }) {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.9,
    viewBox: '0 0 24 24',
  }

  if (name === 'trend') {
    return (
      <svg {...common}>
        <path d="M4 17 9 11l4 4 7-9" />
        <path d="M4 20h16" />
      </svg>
    )
  }

  if (name === 'check') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    )
  }

  if (name === 'clock') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    )
  }

  if (name === 'alert') {
    return (
      <svg {...common}>
        <path d="M12 3 2 21h20L12 3Z" />
        <path d="M12 9v5M12 18h.01" />
      </svg>
    )
  }

  if (name === 'search') {
    return (
      <svg {...common}>
        <path d="m21 21-4.3-4.3" />
        <circle cx="11" cy="11" r="7" />
      </svg>
    )
  }

  if (name === 'arrow-up') {
    return (
      <svg {...common}>
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M12 2v20M17 6.5C15.8 5.4 14.2 5 12.5 5 9.9 5 8 6.2 8 8s1.6 2.7 4.2 3.3C15 12 17 13 17 15.5S14.8 19 12 19c-2 0-3.8-.6-5-1.8" />
    </svg>
  )
}
