import { professionalRepository } from '../repositories/professionalRepository.js'

const cardClass = 'rounded-2xl border border-[#404040] bg-[#262626] shadow-sm'

export function TeamPage({ navigate }) {
  const professionals = professionalRepository.getAll()
  const { slots, weekdays } = professionalRepository.getCoverageMap()

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">Profissionais</h1>
          <p className="mt-1 text-sm text-[#b8b8b8]">Equipe, agenda e cobertura operacional da clínica.</p>
        </div>
        <button
          className="h-10 rounded-sm bg-[#3b82f6] px-4 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
          onClick={() => navigate('/agenda')}
          type="button"
        >
          Ver disponibilidade
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Equipe médica">
        {professionals.map((professional) => (
          <article className={`${cardClass} p-5`} key={professional.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="grid size-11 place-items-center rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-sm font-bold text-[#3b82f6]">
                  {initials(professional.name)}
                </div>
                <h2 className="mt-4 text-lg font-bold text-[#f5f5f5]">{professional.name}</h2>
                <p className="mt-1 text-sm text-[#a3a3a3]">{professional.role}</p>
              </div>
              <StatusPill status={professional.status} />
            </div>

            <dl className="mt-5 grid gap-3 text-sm">
              <Info label="Agenda" value={professional.schedule} />
              <Info label="Próximo horário" value={professional.nextSlot} />
              <Info label="Pacientes ativos" value={professional.patients} />
            </dl>
          </article>
        ))}
      </section>

      <section className={`${cardClass} p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#f5f5f5]">Mapa de cobertura</h2>
            <p className="mt-1 text-sm text-[#a3a3a3]">
              Matriz simples para preparar o fluxo de agenda, plantão e disponibilidade.
            </p>
          </div>
          <button
            className="h-10 rounded-sm border border-[#404040] bg-[#303030] px-4 text-sm font-semibold text-[#e5e5e5] transition hover:border-[#3b82f6]"
            onClick={() => navigate('/configuracoes')}
            type="button"
          >
            Configurar regras
          </button>
        </div>

        <div className="mt-5 overflow-x-auto rounded-sm border border-[#404040]">
          <div className="grid min-w-[720px] grid-cols-[1.2fr_repeat(5,1fr)] bg-[#171717] text-xs font-bold uppercase tracking-[0.16em] text-[#a3a3a3]">
            {['Profissional', ...weekdays].map((label) => (
              <div className="border-b border-[#404040] px-4 py-3" key={label}>
                {label}
              </div>
            ))}
          </div>
          {professionals.map((professional, rowIndex) => (
            <div className="grid min-w-[720px] grid-cols-[1.2fr_repeat(5,1fr)] text-sm" key={professional.id}>
              <div className="border-b border-[#404040] px-4 py-3 font-semibold text-[#f5f5f5]">{professional.name}</div>
              {slots.map((slot, index) => (
                <div className="border-b border-[#404040] px-4 py-3 text-[#b8b8b8]" key={`${professional.id}-${slot}`}>
                  {shiftSlot(slot, rowIndex + index)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-[#737373]">{label}</dt>
      <dd className="mt-1 text-[#e5e5e5]">{value}</dd>
    </div>
  )
}

function StatusPill({ status }) {
  const className =
    status === 'Disponivel'
      ? 'bg-emerald-500/20 text-emerald-400'
      : status === 'Em atendimento'
        ? 'bg-amber-500/20 text-amber-400'
        : 'bg-blue-500/20 text-blue-400'

  return <span className={`rounded px-2 py-1 text-[10px] font-bold ${className}`}>{status}</span>
}

function initials(name) {
  return name
    .replace(/^(Dr\.|Dra\.|Nutri\.|Enf\.)\s+/i, '')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function shiftSlot(slot, index) {
  if (index % 4 === 0) {
    return 'Bloqueado'
  }

  return slot
}
