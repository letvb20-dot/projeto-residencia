import { useMemo, useState } from 'react'

import { appointmentRepository } from '../repositories/appointmentRepository.js'
import { patientRepository } from '../repositories/patientRepository.js'
import { professionalRepository } from '../repositories/professionalRepository.js'

const statusFilters = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Confirmadas', value: 'Confirmada' },
  { label: 'Em triagem', value: 'Em triagem' },
  { label: 'Aguardando', value: 'Aguardando' },
]

const viewFilters = ['Dia', 'Semana', 'Mês']


export function AgendaPage({ navigate }) {
  const patients = patientRepository.getAll()
  const professionals = professionalRepository.getAll()
  const queue = appointmentRepository.getPredictiveQueueSummary()
  const timeline = appointmentRepository.getTodayTimeline()
  const weekDays = appointmentRepository.getWeekDays()
  const [activeView, setActiveView] = useState('Dia')
  const [status, setStatus] = useState('Todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [localAppointments, setLocalAppointments] = useState(() => appointmentRepository.getAll())
  const [form, setForm] = useState({
    patientId: patients[0].id,
    professional: professionals[0].name,
    type: 'Retorno',
    time: '15:30',
    mode: 'Teleconsulta',
  })

  const visibleAppointments = useMemo(() => {
    if (status === 'Todos') {
      return localAppointments
    }

    return localAppointments.filter((appointment) => appointment.status === status)
  }, [localAppointments, status])

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleCreate(event) {
    event.preventDefault()
    const patient = patients.find((item) => item.id === form.patientId) || patients[0]

    setLocalAppointments((current) => [
      ...current,
      {
        id: `apt-local-${current.length + 1}`,
        date: '2026-04-07',
        patient: patient.name,
        patientId: patient.id,
        professional: form.professional,
        room: form.mode === 'Teleconsulta' ? 'Sala virtual 3' : 'Sala 02',
        status: 'Confirmada',
        time: form.time,
        type: form.type,
        mode: form.mode,
      },
    ])
    setModalOpen(false)
  }

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-8 text-[#e5e5e5]">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[32px] font-bold leading-8 tracking-[-0.02em] text-[#e5e5e5]">
            Agenda
          </h1>
          <p className="mt-2 text-sm leading-5 text-[#a3a3a3]">
            Organize consultas, retornos e teleatendimentos do dia.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="h-9 rounded-sm border border-[#404040] bg-[#262626] px-4 text-sm font-medium text-[#e5e5e5] transition hover:bg-[#303030]"
            onClick={() => setStatus('Todos')}
            type="button"
          >
            Hoje
          </button>
          <button
            className="h-9 rounded-sm border border-[#3b82f6] bg-[#3b82f6] px-4 text-sm font-semibold text-white shadow-[0_10px_15px_rgba(59,130,246,0.16)] transition hover:bg-[#3478ed]"
            onClick={() => setModalOpen(true)}
            type="button"
          >
            + Nova consulta
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        {weekDays.map((day) => (
          <button
            className={`rounded-2xl border p-4 text-left transition ${
              day.active
                ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                : 'border-[#404040] bg-[#262626] hover:border-[#525252]'
            }`}
            key={`${day.label}-${day.day}`}
            type="button"
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#a3a3a3]">
              {day.label}
            </span>
            <span className="mt-2 block text-[32px] font-bold leading-8 text-[#e5e5e5]">{day.day}</span>
            <span className="mt-3 block text-sm text-[#3b82f6]">{day.count} consultas</span>
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="rounded-2xl border border-[#404040] bg-[#262626] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold leading-6 text-[#e5e5e5]">Terça, 07 abril</h2>
              <p className="mt-1 text-sm leading-5 text-[#a3a3a3]">
                Visualização: {activeView.toLowerCase()} | {visibleAppointments.length} registros no filtro
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {viewFilters.map((view) => (
                <button
                  className={`h-8 rounded-sm border px-3 text-sm font-semibold transition ${
                    activeView === view
                      ? 'border-[#3b82f6] bg-[#3b82f6] text-white'
                      : 'border-[#404040] bg-[#303030] text-[#a3a3a3] hover:text-[#e5e5e5]'
                  }`}
                  key={view}
                  onClick={() => setActiveView(view)}
                  type="button"
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                className={`h-8 rounded-sm border px-3 text-sm font-semibold transition ${
                  status === filter.value
                    ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]'
                    : 'border-[#404040] bg-[#303030] text-[#a3a3a3] hover:text-[#e5e5e5]'
                }`}
                key={filter.value}
                onClick={() => setStatus(filter.value)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            {visibleAppointments.length ? (
              visibleAppointments.map((appointment) => (
                <AgendaListItem
                  appointment={appointment}
                  key={appointment.id}
                  navigate={navigate}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#404040] bg-[#1f1f1f] p-8 text-center">
                <h3 className="text-base font-bold text-[#e5e5e5]">Nenhum horário encontrado</h3>
                <p className="mt-2 text-sm leading-6 text-[#a3a3a3]">
                  Ajuste o filtro ou crie uma consulta mockada para este período.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-2xl border border-[#404040] bg-[#262626] p-5">
            <h2 className="text-base font-bold text-[#e5e5e5]">Linha do tempo</h2>
            <div className="mt-5 grid gap-1">
              {timeline.map((item) => (
                <button
                  className="grid grid-cols-[58px_1fr] gap-4 rounded-md px-2 py-3 text-left transition hover:bg-[#303030]"
                  disabled={!item.patientId}
                  key={`${item.hour}-${item.patient}`}
                  onClick={() => item.patientId && navigate(`/pacientes/${item.patientId}`)}
                  type="button"
                >
                  <span className="text-sm font-bold text-[#3b82f6]">{item.hour}</span>
                  <span className="border-l border-[#404040] pl-4">
                    <span className="block text-sm font-semibold text-[#e5e5e5]">{item.patient}</span>
                    <span className="mt-1 block text-xs text-[#a3a3a3]">{item.type}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#404040] bg-[#262626] p-5">
            <h2 className="text-base font-bold text-[#e5e5e5]">Resumo preditivo</h2>
            <div className="mt-5 grid gap-3">
              {queue.map((item) => (
                <div className="flex items-center justify-between rounded-md bg-[#2a2a2a] px-4 py-3" key={item.label}>
                  <span className="text-sm font-medium text-[#a3a3a3]">{item.label}</span>
                  <span className={`text-lg font-bold ${queueTone(item.tone)}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <button
              className="mt-5 h-9 rounded-sm border border-[#404040] bg-[#303030] px-4 text-sm font-semibold text-[#e5e5e5] transition hover:border-[#3b82f6] hover:text-[#3b82f6]"
              onClick={() => navigate('/mensagens')}
              type="button"
            >
              Confirmar presenças
            </button>
          </div>
        </div>
      </section>

      <DarkModal onClose={() => setModalOpen(false)} open={modalOpen} title="Nova consulta">
        <form className="grid gap-4" onSubmit={handleCreate}>
          <DarkField label="Paciente">
            <select
              className="h-11 rounded-md border border-[#404040] bg-[#303030] px-3 text-sm text-[#e5e5e5] outline-none focus:border-[#3b82f6]"
              onChange={(event) => updateForm('patientId', event.target.value)}
              value={form.patientId}
            >
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </DarkField>

          <div className="grid gap-4 sm:grid-cols-2">
            <DarkField label="Horário">
              <input
                className="h-11 rounded-md border border-[#404040] bg-[#303030] px-3 text-sm text-[#e5e5e5] outline-none focus:border-[#3b82f6]"
                onChange={(event) => updateForm('time', event.target.value)}
                type="time"
                value={form.time}
              />
            </DarkField>
            <DarkField label="Formato">
              <select
                className="h-11 rounded-md border border-[#404040] bg-[#303030] px-3 text-sm text-[#e5e5e5] outline-none focus:border-[#3b82f6]"
                onChange={(event) => updateForm('mode', event.target.value)}
                value={form.mode}
              >
                <option>Teleconsulta</option>
                <option>Presencial</option>
              </select>
            </DarkField>
          </div>

          <DarkField label="Profissional">
            <select
              className="h-11 rounded-md border border-[#404040] bg-[#303030] px-3 text-sm text-[#e5e5e5] outline-none focus:border-[#3b82f6]"
              onChange={(event) => updateForm('professional', event.target.value)}
              value={form.professional}
            >
              {professionals.map((professional) => (
                <option key={professional.id}>{professional.name}</option>
              ))}
            </select>
          </DarkField>

          <DarkField label="Tipo de consulta">
            <input
              className="h-11 rounded-md border border-[#404040] bg-[#303030] px-3 text-sm text-[#e5e5e5] outline-none focus:border-[#3b82f6]"
              onChange={(event) => updateForm('type', event.target.value)}
              value={form.type}
            />
          </DarkField>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              className="h-10 rounded-sm border border-[#404040] bg-[#303030] px-4 text-sm font-semibold text-[#e5e5e5] transition hover:bg-[#333333]"
              onClick={() => setModalOpen(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="h-10 rounded-sm border border-[#3b82f6] bg-[#3b82f6] px-4 text-sm font-semibold text-white transition hover:bg-[#3478ed]"
              type="submit"
            >
              Salvar consulta
            </button>
          </div>
        </form>
      </DarkModal>
    </div>
  )
}

function AgendaListItem({ appointment, navigate }) {
  return (
    <article className="grid gap-4 rounded-xl border border-[#404040] bg-[#1f1f1f] p-4 md:grid-cols-[72px_1fr_auto]">
      <div>
        <p className="text-xl font-bold leading-7 text-[#e5e5e5]">{appointment.time}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#737373]">
          {appointment.mode}
        </p>
      </div>

      <div>
        <button
          className="text-left text-base font-bold text-[#e5e5e5] transition hover:text-[#3b82f6]"
          onClick={() => navigate(`/pacientes/${appointment.patientId}`)}
          type="button"
        >
          {appointment.patient}
        </button>
        <p className="mt-1 text-sm text-[#a3a3a3]">
          {appointment.type} com {appointment.professional}
        </p>
        <p className="mt-2 text-xs font-medium text-[#737373]">{appointment.room}</p>
      </div>

      <div className="flex items-start justify-between gap-3 md:justify-end">
        <StatusPill status={appointment.status} />
      </div>
    </article>
  )
}

function DarkField({ children, label }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#a3a3a3]">
      <span>{label}</span>
      {children}
    </label>
  )
}

function DarkModal({ children, onClose, open, title }) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="w-full max-w-xl rounded-2xl border border-[#404040] bg-[#262626] shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-[#404040] px-5 py-4">
          <h2 className="text-lg font-bold text-[#e5e5e5]">{title}</h2>
          <button
            aria-label="Fechar"
            className="grid size-8 place-items-center rounded-sm text-xl leading-none text-[#a3a3a3] transition hover:bg-[#303030] hover:text-[#e5e5e5]"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function StatusPill({ status }) {
  const classes = {
    Confirmada: 'border-[#14532d] bg-[#052e1a] text-[#10b981]',
    'Em triagem': 'border-[#78350f] bg-[#2d1e05] text-[#f59e0b]',
    Aguardando: 'border-[#404040] bg-[#303030] text-[#a3a3a3]',
    Bloqueado: 'border-[#404040] bg-[#303030] text-[#737373]',
  }

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${classes[status] || classes.Aguardando}`}>
      {status}
    </span>
  )
}

function queueTone(tone) {
  if (tone === 'red') {
    return 'text-[#ef4444]'
  }

  if (tone === 'amber') {
    return 'text-[#f59e0b]'
  }

  return 'text-[#3b82f6]'
}
