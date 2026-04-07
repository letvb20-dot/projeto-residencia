import { useState } from 'react'

import { analyticsRepository } from '../repositories/analyticsRepository.js'

const periods = [
  ['1m', '1 Mes'],
  ['3m', '3 Meses'],
  ['6m', '6 Meses'],
  ['1a', '1 Ano'],
]

const cardClass = 'rounded-2xl border border-[#404040] bg-[#262626] shadow-sm'

export function AnalyticsPage() {
  const {
    absenteeismData,
    consultationsData,
    doctorPerformance,
    insuranceData,
    kpis,
    revenueData,
    topPatients,
  } = analyticsRepository.getDashboardData()
  const [period, setPeriod] = useState('6m')

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">Relatórios & Analytics</h1>
          <p className="mt-1 text-sm text-[#b8b8b8]">Dashboard executivo com métricas de desempenho</p>
        </div>

        <div className="flex overflow-hidden rounded-sm border border-[#404040] bg-[#171717]">
          {periods.map(([key, label]) => (
            <button
              className={`h-9 px-4 text-xs font-semibold transition ${
                period === key ? 'bg-[#3b82f6] text-white' : 'text-[#b8b8b8] hover:bg-[#303030] hover:text-[#e5e5e5]'
              }`}
              key={key}
              onClick={() => setPeriod(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4" aria-label="Indicadores principais">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2" aria-label="Gráficos principais">
        <ChartCard description="Evolução mensal vs meta" title="Taxa de Absenteísmo">
          <AreaMetricChart data={absenteeismData} />
        </ChartCard>

        <ChartCard description="Agendadas vs realizadas" title="Consultas por Período">
          <GroupedBarChart data={consultationsData} />
        </ChartCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-3" aria-label="Relatórios complementares">
        <ChartCard description="Evolução de receita" title="Faturamento Mensal">
          <RevenueChart data={revenueData} />
        </ChartCard>

        <ChartCard description="Distribuição de atendimentos" title="Convênios">
          <InsuranceBreakdown insuranceData={insuranceData} />
        </ChartCard>

        <ChartCard description="Mais atendidos no período" title="Top Pacientes">
          <div className="space-y-3 pt-1">
            {topPatients.map((patient, index) => (
              <div className="flex items-center gap-3" key={patient.name}>
                <span className="w-4 text-xs font-bold text-[#a3a3a3]">{index + 1}.</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#f5f5f5]">{patient.name}</p>
                  <p className="mt-0.5 text-[10px] text-[#a3a3a3]">
                    {patient.visits} visitas • R$ {patient.revenue.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#303030]">
                  <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${(patient.visits / 12) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className={`${cardClass} p-6`} aria-label="Performance por médico">
        <h2 className="mb-4 text-sm font-bold text-[#f5f5f5]">Performance por Médico</h2>
        <div className="overflow-x-auto rounded-sm border border-[#404040]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#171717] text-xs font-semibold uppercase tracking-[0.02em] text-[#b8b8b8]">
              <tr>
                <th className="px-4 py-3">Profissional</th>
                <th className="px-4 py-3">Consultas</th>
                <th className="px-4 py-3">No-Show</th>
                <th className="px-4 py-3">Taxa No-Show</th>
                <th className="px-4 py-3">Satisfação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#404040] bg-[#262626]">
              {doctorPerformance.map((doctor) => {
                const noShowRate = (doctor.noShow / doctor.consultas) * 100
                return (
                  <tr className="transition hover:bg-[#303030]" key={doctor.name}>
                    <td className="px-4 py-3 font-semibold text-[#f5f5f5]">{doctor.name}</td>
                    <td className="px-4 py-3 text-[#e5e5e5]">{doctor.consultas}</td>
                    <td className="px-4 py-3 text-[#b8b8b8]">{doctor.noShow}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${rateClass(noShowRate)}`}>{noShowRate.toFixed(1)}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#f5f5f5]">
                        <span className="text-amber-400">★</span>
                        {doctor.satisfacao}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function KpiCard({ kpi }) {
  return (
    <article className={`${cardClass} p-5`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-medium text-[#a3a3a3]">{kpi.label}</p>
        <AnalyticsIcon className="size-4 text-[#a3a3a3]" name={kpi.icon} />
      </div>
      <p className="mt-2 text-2xl font-bold leading-none text-[#f5f5f5]">{kpi.value}</p>
      <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-500">
        <AnalyticsIcon className="size-3.5" name={kpi.up ? 'arrow-up' : 'arrow-down'} />
        {kpi.change} vs período anterior
      </span>
    </article>
  )
}

function ChartCard({ children, description, title }) {
  return (
    <article className={`${cardClass} p-6`}>
      <h2 className="text-sm font-bold text-[#f5f5f5]">{title}</h2>
      <p className="mt-1 text-xs text-[#a3a3a3]">{description}</p>
      <div className="mt-4">{children}</div>
    </article>
  )
}

function AreaMetricChart({ data }) {
  const points = getLinePoints(data.map((item) => item.taxa), 0, 24)
  const metaPoints = getLinePoints(data.map((item) => item.meta), 0, 24)
  const area = `${points} 600,260 42,260`

  return (
    <svg className="h-[250px] w-full overflow-visible" role="img" viewBox="0 0 640 300">
      <ChartGrid labels={[24, 18, 12, 6, 0]} />
      <polygon fill="#3b82f6" opacity="0.12" points={area} />
      <polyline fill="none" points={metaPoints} stroke="#64748b" strokeDasharray="6 8" strokeWidth="2" />
      <polyline fill="none" points={points} stroke="#3b82f6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      {data.map((item, index) => (
        <text className="fill-[#94a3b8] text-[13px]" key={item.month} x={42 + index * 111.6} y="285" textAnchor="middle">
          {item.month}
        </text>
      ))}
    </svg>
  )
}

function GroupedBarChart({ data }) {
  return (
    <svg className="h-[250px] w-full overflow-visible" role="img" viewBox="0 0 640 300">
      <ChartGrid labels={[600, 450, 300, 150, 0]} />
      {data.map((item, index) => {
        const x = 58 + index * 94
        const totalHeight = (item.total / 600) * 220
        const doneHeight = (item.realizadas / 600) * 220
        return (
          <g key={item.month}>
            <rect fill="#475569" height={totalHeight} rx="5" width="32" x={x} y={260 - totalHeight} />
            <rect fill="#3b82f6" height={doneHeight} rx="5" width="32" x={x + 38} y={260 - doneHeight} />
            <text className="fill-[#94a3b8] text-[13px]" textAnchor="middle" x={x + 35} y="285">
              {item.month}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function RevenueChart({ data }) {
  const points = getLinePoints(
    data.map((item) => item.valor),
    30000,
    60000,
    { left: 32, top: 18, width: 270, height: 160 },
  )

  return (
    <svg className="h-[200px] w-full overflow-visible" role="img" viewBox="0 0 340 220">
      {[0, 1, 2, 3].map((line) => (
        <line key={line} stroke="#1e3a5f" strokeDasharray="3 5" x1="32" x2="320" y1={20 + line * 50} y2={20 + line * 50} />
      ))}
      <polyline fill="none" points={points} stroke="#10b981" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      {points.split(' ').map((point, index) => {
        const [x, y] = point.split(',').map(Number)
        return <circle cx={x} cy={y} fill="#10b981" key={point} r={4 + (index === data.length - 1 ? 1 : 0)} />
      })}
      {data.map((item, index) => (
        <text className="fill-[#94a3b8] text-[11px]" key={item.month} textAnchor="middle" x={32 + index * 54} y="205">
          {item.month}
        </text>
      ))}
    </svg>
  )
}

function InsuranceBreakdown({ insuranceData }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const segments = insuranceData.reduce((items, item) => {
    const dash = (item.value / 100) * circumference
    const previous = items.at(-1)
    const offset = previous ? previous.offset + previous.dash + 4 : 0

    return [...items, { ...item, dash, offset }]
  }, [])

  return (
    <div>
      <div className="flex justify-center">
        <svg className="h-[160px] w-[160px]" viewBox="0 0 120 120">
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
      <div className="mt-2 space-y-1.5">
        {insuranceData.map((item) => (
          <div className="flex items-center justify-between text-xs" key={item.name}>
            <span className="flex items-center gap-2 text-[#e5e5e5]">
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="text-[#a3a3a3]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartGrid({ labels }) {
  return (
    <>
      {labels.map((label, index) => {
        const y = 20 + index * 60
        return (
          <g key={label}>
            <line stroke="#1e3a5f" strokeDasharray="3 5" x1="42" x2="600" y1={y} y2={y} />
            <text className="fill-[#94a3b8] text-[13px]" textAnchor="end" x="24" y={y + 4}>
              {label}
            </text>
          </g>
        )
      })}
    </>
  )
}

function getLinePoints(values, min, max, box = { left: 42, top: 20, width: 558, height: 240 }) {
  return values
    .map((value, index) => {
      const x = box.left + (index / Math.max(values.length - 1, 1)) * box.width
      const y = box.top + ((max - value) / (max - min)) * box.height
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function rateClass(rate) {
  if (rate > 15) {
    return 'text-red-400'
  }

  if (rate > 10) {
    return 'text-amber-400'
  }

  return 'text-emerald-400'
}

function AnalyticsIcon({ className = 'size-4', name }) {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.9,
    viewBox: '0 0 24 24',
  }

  if (name === 'calendar') {
    return (
      <svg {...common}>
        <path d="M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      </svg>
    )
  }

  if (name === 'activity') {
    return (
      <svg {...common}>
        <path d="M3 12h4l2-6 4 12 2-6h6" />
      </svg>
    )
  }

  if (name === 'dollar') {
    return (
      <svg {...common}>
        <path d="M12 2v20M17 6.5C15.8 5.4 14.2 5 12.5 5 9.9 5 8 6.2 8 8s1.6 2.7 4.2 3.3C15 12 17 13 17 15.5S14.8 19 12 19c-2 0-3.8-.6-5-1.8" />
      </svg>
    )
  }

  if (name === 'users') {
    return (
      <svg {...common}>
        <path d="M16 19a4 4 0 0 0-8 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 19a3 3 0 0 0-3-3M4 19a3 3 0 0 1 3-3" />
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

  if (name === 'arrow-down') {
    return (
      <svg {...common}>
        <path d="M7 7 17 17M17 8v9H8" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M4 17 9 11l4 4 7-9" />
      <path d="M4 20h16" />
    </svg>
  )
}
