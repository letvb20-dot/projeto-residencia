import { useMemo, useState } from 'react'

import { medicalRecordRepository } from '../repositories/medicalRecordRepository.js'


const inputClass =
  'h-10 w-full rounded-lg border border-[#404040] bg-[#1a1a1a] px-3 text-sm text-[#e5e5e5] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]'
const labelClass = 'mb-1 block text-xs font-medium text-[#e5e5e5]'
const cardClass = 'rounded-2xl border border-[#404040] bg-[#262626] shadow-sm'

export function MedicalRecordsPage() {
  const recordTypes = medicalRecordRepository.getRecordTypes()
  const [records, setRecords] = useState(() => medicalRecordRepository.getInitialRecords())
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch = [record.patient, record.cid, record.doctor]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesType = !filterType || record.type === filterType

      return matchesSearch && matchesType
    })
  }, [filterType, records, search])

  function handleCreateRecord(record) {
    setRecords((currentRecords) => [record, ...currentRecords])
    setEditorOpen(false)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-[#e5e5e5]">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#e5e5e5]">Prontuário Médico</h1>
          <p className="mt-1 text-sm text-[#a3a3a3]">Registro de consultas, diagnósticos e evolução</p>
        </div>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#3b82f6] px-4 text-sm font-medium text-white transition hover:bg-[#2563eb]"
          onClick={() => setEditorOpen(true)}
          type="button"
        >
          <RecordIcon name="plus" />
          Nova Consulta
        </button>
      </div>

      <section className={`${cardClass} p-4`}>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <RecordIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a3a3a3]" name="search" />
            <input
              className="h-10 w-full rounded-lg border border-[#404040] bg-[#1a1a1a] py-2 pl-10 pr-3 text-sm text-[#e5e5e5] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por paciente ou CID..."
              value={search}
            />
          </div>
          <div className="relative min-w-48">
            <select
              className="h-10 w-full appearance-none rounded-lg border border-[#404040] bg-[#1a1a1a] px-3 pr-9 text-sm font-semibold text-[#e5e5e5] outline-none transition focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              onChange={(event) => setFilterType(event.target.value)}
              value={filterType}
            >
              <option value="">Todos os Tipos</option>
              {recordTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <RecordIcon className="pointer-events-none absolute right-3 top-3 size-4 text-[#a3a3a3]" name="chevron-down" />
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {filteredRecords.length ? (
          filteredRecords.map((record) => <RecordCard key={record.id} record={record} />)
        ) : (
          <div className={`${cardClass} p-8 text-center text-sm text-[#a3a3a3]`}>
            Nenhum registro encontrado nos dados locais.
          </div>
        )}
      </div>

      {editorOpen ? (
        <RecordEditorModal
          onClose={() => setEditorOpen(false)}
          onSave={handleCreateRecord}
          recordTypes={recordTypes}
        />
      ) : null}
    </div>
  )
}

function RecordCard({ record }) {
  const statusClass =
    record.status === 'completo'
      ? 'bg-emerald-500/20 text-emerald-400'
      : 'bg-amber-500/20 text-amber-400'

  return (
    <article className={`${cardClass} cursor-pointer p-5 transition hover:border-[#3b82f6]/30`}>
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#3b82f6]/10 text-[#3b82f6]">
            <RecordIcon className="size-5" name="file" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-[#e5e5e5]">{record.patient}</h2>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${statusClass}`}>
                {record.status === 'completo' ? 'Completo' : 'Rascunho'}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#a3a3a3]">
              <span className="flex items-center gap-1">
                <RecordIcon className="size-3" name="calendar" />
                {record.date}
              </span>
              <span className="flex items-center gap-1">
                <RecordIcon className="size-3" name="user" />
                {record.doctor}
              </span>
              <span className="flex items-center gap-1">
                <RecordIcon className="size-3" name="activity" />
                {record.type}
              </span>
            </div>
            <p className="mt-2 inline-block rounded bg-[#1a1a1a] px-2 py-1 text-xs text-[#a3a3a3]">{record.cid}</p>
            <p className="mt-2 text-xs leading-5 text-[#a3a3a3]">{record.summary}</p>
          </div>
        </div>
        <div className="ml-14 flex items-center gap-2 md:ml-0">
          <IconButton label="Visualizar" name="eye" />
          <IconButton label="Editar" name="edit" />
          <IconButton label="Imprimir" name="printer" />
        </div>
      </div>
    </article>
  )
}

function IconButton({ label, name }) {
  return (
    <button
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg border border-[#404040] bg-[#1a1a1a] text-[#a3a3a3] transition hover:bg-[#2a2a2a] hover:text-[#e5e5e5]"
      title={label}
      type="button"
    >
      <RecordIcon className="size-4" name={name} />
    </button>
  )
}

function RecordEditorModal({ onClose, onSave, recordTypes }) {
  const [formData, setFormData] = useState({
    patient: '',
    date: '',
    type: 'Primeira Consulta',
    cid: '',
    anamnesis: '',
    physicalExam: '',
    conduct: '',
    prescriptions: '',
    returnDate: '',
    status: 'completo',
  })

  function updateField(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const submitter = event.nativeEvent.submitter
    const status = submitter?.value || formData.status

    onSave({
      id: `record-${Date.now()}`,
      patient: formData.patient || 'Paciente sem nome',
      date: formData.date ? formatDate(formData.date) : '07/04/2026',
      doctor: 'Dr. Henrique Cardoso',
      type: formData.type,
      cid: formData.cid || 'CID nao informado',
      status,
      summary: formData.conduct || formData.anamnesis || 'Registro criado localmente para simulação.',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <form
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#404040] bg-[#262626] p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className="mb-6 text-lg font-bold text-[#e5e5e5]">Novo Registro de Consulta</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DarkField label="Paciente">
              <input
                className={inputClass}
                name="patient"
                onChange={updateField}
                placeholder="Buscar paciente..."
                value={formData.patient}
              />
            </DarkField>
            <DarkField label="Data da Consulta">
              <input
                className={`${inputClass} [color-scheme:dark]`}
                name="date"
                onChange={updateField}
                type="date"
                value={formData.date}
              />
            </DarkField>
          </div>

          <DarkField label="Anamnese">
            <textarea
              className={`${inputClass} min-h-24 py-2`}
              name="anamnesis"
              onChange={updateField}
                placeholder="Queixa principal, história da doença atual..."
              value={formData.anamnesis}
            />
          </DarkField>

          <DarkField label="Exame Físico">
            <textarea
              className={`${inputClass} min-h-24 py-2`}
              name="physicalExam"
              onChange={updateField}
              placeholder="Achados do exame físico..."
              value={formData.physicalExam}
            />
          </DarkField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DarkField label="Hipóteses Diagnósticas (CID-10)">
              <input
                className={inputClass}
                name="cid"
                onChange={updateField}
                placeholder="Ex: I10, E11.9..."
                value={formData.cid}
              />
            </DarkField>
            <DarkField label="Tipo de Consulta">
              <select className={inputClass} name="type" onChange={updateField} value={formData.type}>
                {recordTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </DarkField>
          </div>

          <DarkField label="Conduta Médica">
            <textarea
              className={`${inputClass} min-h-24 py-2`}
              name="conduct"
              onChange={updateField}
              placeholder="Plano terapêutico, orientações..."
              value={formData.conduct}
            />
          </DarkField>

          <DarkField label="Prescrições">
            <textarea
              className={`${inputClass} min-h-20 py-2`}
              name="prescriptions"
              onChange={updateField}
              placeholder="Medicamentos, posologia..."
              value={formData.prescriptions}
            />
          </DarkField>

          <DarkField label="Retorno Agendado">
            <input
              className={`${inputClass} [color-scheme:dark]`}
              name="returnDate"
              onChange={updateField}
              type="date"
              value={formData.returnDate}
            />
          </DarkField>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            className="rounded-lg border border-[#404040] bg-[#262626] px-4 py-2 text-sm font-medium text-[#e5e5e5] transition hover:bg-[#333333]"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="rounded-lg border border-[#404040] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-[#e5e5e5] transition hover:bg-[#333333]"
            type="submit"
            value="rascunho"
          >
            Salvar Rascunho
          </button>
          <button
            className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2563eb]"
            type="submit"
            value="completo"
          >
            Finalizar
          </button>
        </div>
      </form>
    </div>
  )
}

function DarkField({ children, label }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  )
}

function formatDate(value) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

function RecordIcon({ className = 'size-4', name }) {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  }

  if (name === 'search') {
    return (
      <svg {...common}>
        <path d="m21 21-4.3-4.3" />
        <circle cx="11" cy="11" r="7" />
      </svg>
    )
  }

  if (name === 'plus') {
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    )
  }

  if (name === 'file') {
    return (
      <svg {...common}>
        <path d="M7 3h7l4 4v14H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </svg>
    )
  }

  if (name === 'calendar') {
    return (
      <svg {...common}>
        <path d="M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      </svg>
    )
  }

  if (name === 'user') {
    return (
      <svg {...common}>
        <path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
      </svg>
    )
  }

  if (name === 'activity') {
    return (
      <svg {...common}>
        <path d="M3 12h4l2-5 4 10 2-5h6" />
      </svg>
    )
  }

  if (name === 'eye') {
    return (
      <svg {...common}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  if (name === 'edit') {
    return (
      <svg {...common}>
        <path d="m16 3 5 5L8 21H3v-5L16 3Z" />
      </svg>
    )
  }

  if (name === 'printer') {
    return (
      <svg {...common}>
        <path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
        <path d="M7 14h10v7H7zM17 12h.01" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
