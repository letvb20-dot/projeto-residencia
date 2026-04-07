import { useMemo, useState } from 'react'

import { patientRepository } from '../repositories/patientRepository.js'
const ITEMS_PER_PAGE = 25

const darkInput =
  'h-10 w-full rounded-lg border border-[#404040] bg-[#1a1a1a] px-3 text-sm text-[#e5e5e5] outline-none transition placeholder:text-[#737373] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]'
const darkLabel = 'mb-1.5 block text-xs font-medium text-[#e5e5e5]'
const darkCard = 'rounded-2xl border border-[#404040] bg-[#262626] p-6 shadow-sm'

const patientTabs = [
  { label: 'Resumo', value: 'resumo' },
  { label: 'Consultas', value: 'consultas' },
  { label: 'Documentos', value: 'documentos' },
]

export function PatientsPage({ navigate }) {
  const [rows, setRows] = useState(() => buildPatientRows())
  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [insurance, setInsurance] = useState('')
  const [vip, setVip] = useState('')
  const [birthday, setBirthday] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [lastVisitSince, setLastVisitSince] = useState('')
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [page, setPage] = useState(1)

  const editingPatient = rows.find((patient) => patient.id === editingId)
  const insuranceOptions = useMemo(() => [...new Set(rows.map((patient) => patient.insurance).filter(Boolean))], [rows])
  const stateOptions = useMemo(() => [...new Set(rows.map((patient) => patient.state).filter(Boolean))], [rows])
  const hasAdvancedFilters = city || state || ageMin || ageMax || lastVisitSince

  const filteredPatients = useMemo(() => {
    return rows.filter((patient) => {
      const haystack = [patient.name, patient.cpf, patient.document, patient.insurance, patient.phone]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (search && !haystack.includes(search.toLowerCase())) {
        return false
      }

      if (insurance && patient.insurance !== insurance) {
        return false
      }

      if (vip === 'Sim' && !patient.vip) {
        return false
      }

      if (vip === 'Nao' && patient.vip) {
        return false
      }

      if (birthday === 'Hoje' && patient.birthday !== '07/04') {
        return false
      }

      if (birthday === 'Neste mes' && !patient.birthday?.endsWith('/04')) {
        return false
      }

      if (city && !patient.city.toLowerCase().includes(city.toLowerCase())) {
        return false
      }

      if (state && patient.state !== state) {
        return false
      }

      if (ageMin && patient.age < Number(ageMin)) {
        return false
      }

      if (ageMax && patient.age > Number(ageMax)) {
        return false
      }

      if (lastVisitSince && patient.lastVisitIso && patient.lastVisitIso < lastVisitSince) {
        return false
      }

      return true
    })
  }, [ageMax, ageMin, birthday, city, insurance, lastVisitSince, rows, search, state, vip])

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  function resetAdvancedFilters() {
    setCity('')
    setState('')
    setAgeMin('')
    setAgeMax('')
    setLastVisitSince('')
    setAdvancedOpen(false)
    setPage(1)
  }

  function openForm(patientId = null) {
    setEditingId(patientId)
    setOpenMenuId(null)
    setView('form')
  }

  function savePatient(patient) {
    setRows((currentRows) => {
      if (currentRows.some((item) => item.id === patient.id)) {
        return currentRows.map((item) => (item.id === patient.id ? patient : item))
      }

      return [patient, ...currentRows]
    })
    setEditingId(null)
    setPage(1)
    setView('list')
  }

  function deletePatient(patientId) {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      setRows((currentRows) => currentRows.filter((patient) => patient.id !== patientId))
      setOpenMenuId(null)
      setPage(1)
    }
  }

  function openDetail(patient) {
    setOpenMenuId(null)
    if (patient.detailId) {
      navigate(`/pacientes/${patient.detailId}`)
      return
    }

    openForm(patient.id)
  }

  if (view === 'form') {
    return (
      <PatientEditor
        existingIds={rows.map((patient) => patient.id)}
        onCancel={() => {
          setEditingId(null)
          setView('list')
        }}
        onSave={savePatient}
        patient={editingPatient}
      />
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-[#e5e5e5]">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#e5e5e5]">Pacientes</h1>
          <p className="mt-1 text-sm text-[#a3a3a3]">Gerencie as informacoes de seus pacientes</p>
        </div>
        <button
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#3b82f6] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#2563eb] md:w-auto"
          onClick={() => openForm()}
          type="button"
        >
          <PatientIcon name="user-plus" />
          Adicionar
        </button>
      </div>

      <section className="rounded-2xl border border-[#404040] bg-[#262626] px-6 py-8 shadow-sm xl:py-14">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <PatientIcon className="size-4 text-[#a3a3a3]" name="search" />
            </span>
            <input
              className="h-11 w-full rounded-lg border border-[#404040] bg-[#303030] py-2.5 pl-10 pr-4 text-sm text-[#e5e5e5] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Buscar por nome ou documento..."
              value={search}
            />
          </div>

          <PatientSelect
            icon="file"
            label="Selecione o Convenio"
            onChange={(value) => {
              setInsurance(value)
              setPage(1)
            }}
            options={insuranceOptions}
            value={insurance}
          />

          <PatientSelect
            icon="star"
            label="Selecione (VIP)"
            onChange={(value) => {
              setVip(value)
              setPage(1)
            }}
            options={['Sim', 'Nao']}
            value={vip}
          />

          <div className="flex gap-2">
            <PatientSelect
              className="flex-1"
              icon="calendar"
              label="Aniversariantes"
              onChange={(value) => {
                setBirthday(value)
                setPage(1)
              }}
              options={['Hoje', 'Neste mes']}
              value={birthday}
            />
            <button
              className={`grid size-11 shrink-0 place-items-center rounded-lg border transition ${
                hasAdvancedFilters
                  ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]'
                  : 'border-[#404040] bg-[#303030] text-[#e5e5e5] hover:bg-[#333333]'
              }`}
              onClick={() => setAdvancedOpen(true)}
              title="Filtro avancado"
              type="button"
            >
              <PatientIcon className="size-4" name="filter" />
            </button>
          </div>
        </div>

        {hasAdvancedFilters ? (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#a3a3a3]">Filtros ativos:</span>
            {city ? <FilterChip label={`Cidade: ${city}`} onClear={() => setCity('')} /> : null}
            {state ? <FilterChip label={`Estado: ${state}`} onClear={() => setState('')} /> : null}
            {ageMin ? <FilterChip label={`Idade min: ${ageMin}`} onClear={() => setAgeMin('')} /> : null}
            {ageMax ? <FilterChip label={`Idade max: ${ageMax}`} onClear={() => setAgeMax('')} /> : null}
            {lastVisitSince ? (
              <FilterChip label={`Desde: ${lastVisitSince}`} onClear={() => setLastVisitSince('')} />
            ) : null}
            <button className="text-xs text-[#ef4444] hover:underline" onClick={resetAdvancedFilters} type="button">
              Limpar todos
            </button>
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-lg border border-[#404040]">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="bg-[#171717] text-xs font-semibold uppercase text-[#a3a3a3]">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4">Cidade</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Ultimo atendimento</th>
                <th className="px-6 py-4">Proximo atendimento</th>
                <th className="px-6 py-4 text-right">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#404040] bg-[#262626]">
              {paginatedPatients.length ? (
                paginatedPatients.map((patient) => (
                  <tr className="transition hover:bg-[#303030]" key={patient.id}>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-3 text-left" onClick={() => openDetail(patient)} type="button">
                        <span className="grid size-8 place-items-center rounded-full bg-[#333333] text-xs font-bold text-[#3b82f6]">
                          {patient.name.charAt(0)}
                        </span>
                        <span>
                          <span className="block font-medium text-[#e5e5e5] transition hover:text-[#3b82f6]">
                            {patient.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-[#a3a3a3]">
                            {patient.insurance || 'Sem convenio'} {patient.vip ? ' | VIP' : ''}
                          </span>
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-[#a3a3a3]">{patient.phone}</td>
                    <td className="px-6 py-4 text-[#a3a3a3]">{patient.city}</td>
                    <td className="px-6 py-4 text-[#a3a3a3]">{patient.state}</td>
                    <td className="px-6 py-4 text-[#a3a3a3]">{patient.lastVisit || 'Ainda nao houve atendimento'}</td>
                    <td className="px-6 py-4 text-[#a3a3a3]">{patient.nextVisit || 'Nenhum atendimento agendado'}</td>
                    <td className="relative px-6 py-4 text-right">
                      <button
                        aria-label={`Acoes de ${patient.name}`}
                        className="rounded p-1 text-[#a3a3a3] transition hover:bg-[#333333] hover:text-[#e5e5e5]"
                        onClick={() => setOpenMenuId(openMenuId === patient.id ? null : patient.id)}
                        type="button"
                      >
                        <PatientIcon className="size-5" name="more" />
                      </button>
                      {openMenuId === patient.id ? (
                        <>
                          <button
                            aria-label="Fechar menu"
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() => setOpenMenuId(null)}
                            type="button"
                          />
                          <div className="absolute right-8 top-10 z-20 w-48 rounded-lg border border-[#404040] bg-[#303030] py-1 text-left shadow-lg">
                            <ActionItem icon="file" label="Ver detalhes" onClick={() => openDetail(patient)} />
                            <ActionItem icon="edit" label="Editar" onClick={() => openForm(patient.id)} />
                            <ActionItem
                              icon="calendar"
                              label="Marcar consulta"
                              onClick={() => {
                                setOpenMenuId(null)
                                navigate('/agenda')
                              }}
                            />
                            <ActionItem danger icon="trash" label="Excluir" onClick={() => deletePatient(patient.id)} />
                          </div>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-10 text-center text-[#a3a3a3]" colSpan={7}>
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-4 border-t border-[#404040] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#a3a3a3]">
            Mostrando {filteredPatients.length ? startIndex + 1 : 0}-
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredPatients.length)} de {filteredPatients.length} pacientes
          </p>
          <div className="flex items-center gap-2">
            <PageButton disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
              <PatientIcon className="size-4" name="chevron-left" />
            </PageButton>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                className={`grid size-8 place-items-center rounded-lg text-xs font-medium transition ${
                  pageNumber === currentPage
                    ? 'bg-[#3b82f6] text-white'
                    : 'border border-[#404040] bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#333333]'
                }`}
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                type="button"
              >
                {pageNumber}
              </button>
            ))}
            <PageButton disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
              <PatientIcon className="size-4" name="chevron-right" />
            </PageButton>
          </div>
        </div>
      </section>

      {advancedOpen ? (
        <AdvancedFilterModal
          ageMax={ageMax}
          ageMin={ageMin}
          city={city}
          lastVisitSince={lastVisitSince}
          onApply={() => {
            setPage(1)
            setAdvancedOpen(false)
          }}
          onClear={resetAdvancedFilters}
          onClose={() => setAdvancedOpen(false)}
          setAgeMax={setAgeMax}
          setAgeMin={setAgeMin}
          setCity={setCity}
          setLastVisitSince={setLastVisitSince}
          setState={setState}
          state={state}
          stateOptions={stateOptions}
        />
      ) : null}
    </div>
  )
}

function PatientEditor({ existingIds, onCancel, onSave, patient }) {
  const [formData, setFormData] = useState(() => ({
    id: patient?.id || '',
    detailId: patient?.detailId || null,
    name: patient?.name || '',
    cpf: patient?.cpf || '',
    phone: patient?.phone || '',
    email: patient?.email || '',
    city: patient?.city || '',
    state: patient?.state || '',
    insurance: patient?.insurance || '',
    plan: patient?.plan || '',
    age: patient?.age || '',
    condition: patient?.condition || '',
    birthday: patient?.birthday || '',
    vip: Boolean(patient?.vip),
    lastVisit: patient?.lastVisit || null,
    nextVisit: patient?.nextVisit || null,
    lastVisitIso: patient?.lastVisitIso || null,
  }))
  const [attachmentsOpen, setAttachmentsOpen] = useState(false)

  function handleChange(event) {
    const { checked, name, type, value } = event.target
    let nextValue = type === 'checkbox' ? checked : value

    if (name === 'cpf') {
      nextValue = maskCPF(value)
    }

    if (name === 'phone') {
      nextValue = maskPhone(value)
    }

    setFormData((currentData) => ({ ...currentData, [name]: nextValue }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formData.name.trim()) {
      window.alert('O nome e obrigatorio.')
      return
    }

    onSave({
      ...formData,
      id: formData.id || uniqueSlug(formData.name, existingIds),
      age: Number(formData.age) || 0,
      birthday: formData.birthday || '07/04',
      city: formData.city || 'Cidade nao informada',
      document: formData.cpf ? `CPF ${formData.cpf}` : 'CPF nao informado',
      insurance: formData.insurance || 'Particular',
      lastVisit: formData.lastVisit || 'Ainda nao houve atendimento',
      nextVisit: formData.nextVisit || null,
      phone: formData.phone || 'Telefone nao informado',
      plan: formData.insurance || formData.plan || 'Particular',
      state: formData.state || 'UF',
    })
  }

  return (
    <div className="relative pb-20 text-[#e5e5e5]">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-[#404040] pb-6 md:flex-row">
        <div className="flex items-start gap-4">
          <button
            className="mt-1 grid size-10 place-items-center rounded-lg border border-[#404040] bg-[#262626] text-[#e5e5e5] transition hover:bg-[#333333]"
            onClick={onCancel}
            type="button"
          >
            <PatientIcon className="size-5" name="arrow-left" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#e5e5e5]">Paciente</h1>
            <p className="mt-1 text-sm text-[#a3a3a3]">Gerencie as informacoes de seus pacientes</p>
          </div>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
          <section className={darkCard}>
            <h2 className="mb-6 text-lg font-semibold text-[#e5e5e5]">Dados do Paciente</h2>
            <div className="mb-8 flex flex-col items-start gap-4 md:flex-row">
              <div className="grid size-20 shrink-0 place-items-center rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/20 text-[#3b82f6]">
                <PatientIcon className="size-10" name="user" />
              </div>
              <button
                className="mt-2 rounded-lg border border-[#404040] bg-[#1a1a1a] px-4 py-1.5 text-sm font-medium text-[#e5e5e5] transition hover:bg-[#333333]"
                type="button"
              >
                Carregar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12">
              <DarkField className="md:col-span-6" label="Nome *">
                <input className={darkInput} name="name" onChange={handleChange} required value={formData.name} />
              </DarkField>
              <DarkField className="md:col-span-3" label="CPF">
                <input className={darkInput} maxLength={14} name="cpf" onChange={handleChange} value={formData.cpf} />
              </DarkField>
              <DarkField className="md:col-span-3" label="Idade">
                <input className={darkInput} min="0" name="age" onChange={handleChange} type="number" value={formData.age} />
              </DarkField>
              <DarkField className="md:col-span-3" label="Data de Nascimento">
                <input className={`${darkInput} [color-scheme:dark]`} type="date" />
              </DarkField>
              <DarkField className="md:col-span-3" label="Aniversario">
                <input className={darkInput} maxLength={5} name="birthday" onChange={handleChange} placeholder="07/04" value={formData.birthday} />
              </DarkField>
              <DarkField className="md:col-span-3" label="Etnia">
                <select className={darkInput} defaultValue="">
                  <option value="">Selecione</option>
                  <option>Indigena</option>
                  <option>Nao Indigena</option>
                </select>
              </DarkField>
              <DarkField className="md:col-span-3" label="Estado civil">
                <select className={darkInput} defaultValue="">
                  <option value="">Selecione</option>
                  <option>Solteiro(a)</option>
                  <option>Casado(a)</option>
                  <option>Divorciado(a)</option>
                </select>
              </DarkField>
              <DarkField className="md:col-span-6" label="Nome da mae">
                <input className={darkInput} />
              </DarkField>
              <DarkField className="md:col-span-6" label="Nome do pai">
                <input className={darkInput} />
              </DarkField>
              <DarkField className="md:col-span-12" label="Observacoes">
                <textarea className={`${darkInput} min-h-24 py-2`} />
              </DarkField>
              <div className="md:col-span-12">
                <button
                  className="flex w-full items-center justify-between rounded-lg border border-[#404040] bg-[#1a1a1a] p-4 text-left text-sm font-medium text-[#e5e5e5] transition hover:bg-[#333333]"
                  onClick={() => setAttachmentsOpen((open) => !open)}
                  type="button"
                >
                  <span className="flex items-center gap-2">
                    <PatientIcon className="size-4 text-[#a3a3a3]" name="paperclip" />
                    Anexos do paciente
                  </span>
                  <PatientIcon className="size-4 text-[#a3a3a3]" name={attachmentsOpen ? 'chevron-up' : 'chevron-down'} />
                </button>
                {attachmentsOpen ? <UploadDropzone /> : null}
              </div>
            </div>
          </section>

          <section className={darkCard}>
            <h2 className="mb-6 text-lg font-semibold text-[#e5e5e5]">Contato</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12">
              <DarkField className="md:col-span-4" label="E-mail">
                <input className={darkInput} name="email" onChange={handleChange} type="email" value={formData.email} />
              </DarkField>
              <DarkField className="md:col-span-4" label="Celular">
                <input className={darkInput} maxLength={15} name="phone" onChange={handleChange} value={formData.phone} />
              </DarkField>
              <DarkField className="md:col-span-4" label="Telefone 2">
                <input className={darkInput} />
              </DarkField>
            </div>
          </section>

          <section className={darkCard}>
            <h2 className="mb-6 text-lg font-semibold text-[#e5e5e5]">Endereco</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12">
              <DarkField className="md:col-span-3" label="CEP">
                <input className={darkInput} maxLength={9} onChange={maskCEPInput} placeholder="_____-___" />
              </DarkField>
              <DarkField className="md:col-span-5" label="Endereco">
                <input className={darkInput} />
              </DarkField>
              <DarkField className="md:col-span-4" label="Cidade">
                <input className={darkInput} name="city" onChange={handleChange} value={formData.city} />
              </DarkField>
              <DarkField className="md:col-span-4" label="Estado">
                <select className={darkInput} name="state" onChange={handleChange} value={formData.state}>
                  <option value="">Selecione</option>
                  <option value="PE">Pernambuco</option>
                  <option value="SE">Sergipe</option>
                  <option value="SP">Sao Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                </select>
              </DarkField>
            </div>
          </section>

          <section className={darkCard}>
            <h2 className="mb-6 text-lg font-semibold text-[#e5e5e5]">Informacoes de convenio</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12">
              <DarkField className="md:col-span-6" label="Convenio">
                <select className={darkInput} name="insurance" onChange={handleChange} value={formData.insurance}>
                  <option value="">Selecione</option>
                  <option value="Unimed">Unimed</option>
                  <option value="Bradesco Saude">Bradesco Saude</option>
                  <option value="Amil">Amil</option>
                  <option value="Particular">Particular</option>
                </select>
              </DarkField>
              <DarkField className="md:col-span-6" label="Plano">
                <input className={darkInput} name="plan" onChange={handleChange} value={formData.plan} />
              </DarkField>
              <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-[#e5e5e5] md:col-span-12">
                <input className="size-4 accent-[#3b82f6]" checked={formData.vip} name="vip" onChange={handleChange} type="checkbox" />
                Paciente VIP
              </label>
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4">
            <button
              className="rounded-lg border border-[#404040] bg-[#262626] px-5 py-2.5 text-sm font-medium text-[#e5e5e5] transition hover:bg-[#333333]"
              onClick={onCancel}
              type="button"
            >
              Cancelar
            </button>
            <button className="rounded-lg bg-[#3b82f6] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#2563eb]" type="submit">
              Salvar alteracoes
            </button>
          </div>
      </form>
    </div>
  )
}

export function PatientDetailPage({ navigate, patient }) {
  const [activeTab, setActiveTab] = useState('resumo')

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <button
            className="mt-1 grid size-10 place-items-center rounded-sm border border-[#404040] bg-[#262626] text-[#e5e5e5] transition hover:bg-[#303030]"
            onClick={() => navigate('/pacientes')}
            type="button"
          >
            <PatientIcon className="size-5" name="chevron-left" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3b82f6]">Dados do Paciente</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#f5f5f5]">{patient.name}</h1>
            <p className="mt-1 text-sm text-[#b8b8b8]">
              {patient.condition} • {patient.status} • {patient.document}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="h-10 rounded-sm border border-[#404040] bg-[#262626] px-4 text-sm font-semibold text-[#e5e5e5] transition hover:bg-[#303030]"
            onClick={() => navigate('/camunicacao')}
            type="button"
          >
            Enviar mensagem
          </button>
          <button
            className="h-10 rounded-sm bg-[#3b82f6] px-4 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
            onClick={() => navigate('/agenda')}
            type="button"
          >
            Novo retorno
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryTile label="Idade" value={`${patient.age} anos`} />
        <SummaryTile label="Risco" value={patient.risk} tone={riskColor(patient.risk)} />
        <SummaryTile label="Última consulta" value={patient.lastVisit} />
        <SummaryTile label="Próxima consulta" value={patient.nextVisit} />
      </section>

      <section className={darkCard}>
        <div className="flex gap-4 border-b border-[#404040]">
          {patientTabs.map((tab) => (
            <button
              className={`border-b-2 px-2 pb-3 text-sm font-semibold transition ${
                activeTab === tab.value
                  ? 'border-[#3b82f6] text-[#3b82f6]'
                  : 'border-transparent text-[#b8b8b8] hover:text-[#e5e5e5]'
              }`}
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === 'resumo' ? <PatientSummary patient={patient} /> : null}
          {activeTab === 'consultas' ? <PatientVisits navigate={navigate} patient={patient} /> : null}
          {activeTab === 'documentos' ? <PatientDocuments patient={patient} /> : null}
        </div>
      </section>
    </div>
  )
}

function PatientSummary({ patient }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <h2 className="text-xl font-bold text-[#f5f5f5]">Resumo clínico</h2>
        <div className="mt-4 grid gap-3">
          {patient.notes.map((note) => (
            <p className="rounded-xl border border-[#404040] bg-[#171717] p-4 text-sm leading-6 text-[#b8b8b8]" key={note}>
              {note}
            </p>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-[#404040] bg-[#171717] p-4">
        <h3 className="font-bold text-[#f5f5f5]">Contato e equipe</h3>
        <dl className="mt-4 grid gap-3 text-sm">
          <InfoRow label="Telefone" value={patient.phone} />
          <InfoRow label="E-mail" value={patient.email} />
          <InfoRow label="Endereço" value={patient.address} />
          <InfoRow label="Equipe" value={patient.team.join(', ')} />
        </dl>
      </div>
    </div>
  )
}

function PatientVisits({ navigate, patient }) {
  return (
    <div className="grid gap-3">
      {[
        { date: patient.nextVisit, status: 'Agendada', description: `Retorno para ${patient.condition}` },
        { date: patient.lastVisit, status: 'Finalizada', description: 'Consulta registrada no historico local.' },
      ].map((visit) => (
        <div className="rounded-xl border border-[#404040] bg-[#171717] p-4" key={`${visit.date}-${visit.status}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-[#f5f5f5]">{visit.date}</p>
              <p className="mt-1 text-sm text-[#a3a3a3]">{visit.description}</p>
            </div>
            <span
              className={`rounded px-2 py-1 text-xs font-bold ${
                visit.status === 'Agendada' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#303030] text-[#a3a3a3]'
              }`}
            >
              {visit.status}
            </span>
          </div>
        </div>
      ))}
      <button
        className="h-10 justify-self-start rounded-sm border border-[#404040] bg-[#303030] px-4 text-sm font-semibold text-[#e5e5e5] transition hover:border-[#3b82f6]"
        onClick={() => navigate('/consultas')}
        type="button"
      >
        Abrir fila de consultas
      </button>
    </div>
  )
}

function PatientDocuments({ patient }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {patient.exams.map((exam) => (
        <div className="rounded-xl border border-[#404040] bg-[#171717] p-4" key={exam}>
          <p className="font-semibold text-[#f5f5f5]">{exam}</p>
          <p className="mt-2 text-sm text-[#a3a3a3]">Pendente de revisão mockada.</p>
          <span className="mt-4 inline-flex rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-400">
            A revisar
          </span>
        </div>
      ))}
    </div>
  )
}

function SummaryTile({ label, tone = null, value }) {
  return (
    <article className="rounded-2xl border border-[#404040] bg-[#262626] p-4 shadow-sm">
      <p className="text-sm font-medium text-[#a3a3a3]">{label}</p>
      <div className="mt-3">
        {tone ? (
          <span className={`rounded px-2.5 py-1 text-xs font-bold ${tone}`}>{value}</span>
        ) : (
          <p className="text-xl font-bold text-[#f5f5f5]">{value}</p>
        )}
      </div>
    </article>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <dt className="font-semibold text-[#737373]">{label}</dt>
      <dd className="mt-1 text-[#e5e5e5]">{value}</dd>
    </div>
  )
}

function riskColor(risk) {
  if (risk === 'Alto') {
    return 'bg-red-500/20 text-red-400'
  }

  if (risk === 'Moderado') {
    return 'bg-amber-500/20 text-amber-400'
  }

  return 'bg-emerald-500/20 text-emerald-400'
}

function PatientSelect({ className = '', icon, label, onChange, options, value }) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <PatientIcon className="size-4 text-[#a3a3a3]" name={icon} />
      </div>
      <select
        className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-[#404040] bg-[#303030] py-2.5 pl-10 pr-8 text-sm text-[#a3a3a3] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <PatientIcon className="pointer-events-none absolute right-3 top-3.5 size-4 text-[#a3a3a3]" name="chevron-down" />
    </div>
  )
}

function FilterChip({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-[#3b82f6]/10 px-2 py-1 text-xs text-[#3b82f6]">
      {label}
      <button aria-label={`Remover ${label}`} onClick={onClear} type="button">
        <PatientIcon className="size-3" name="x" />
      </button>
    </span>
  )
}

function PageButton({ children, disabled, onClick }) {
  return (
    <button
      className="grid size-8 place-items-center rounded-lg border border-[#404040] bg-[#1a1a1a] text-[#e5e5e5] transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-30"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function ActionItem({ danger = false, icon, label, onClick }) {
  return (
    <button
      className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition ${
        danger ? 'text-[#ef4444] hover:bg-[#ef4444]/10' : 'text-[#e5e5e5] hover:bg-[#333333]'
      }`}
      onClick={onClick}
      type="button"
    >
      <PatientIcon className="size-4" name={icon} />
      {label}
    </button>
  )
}

function DarkField({ children, className = '', label }) {
  return (
    <label className={`block ${className}`}>
      <span className={darkLabel}>{label}</span>
      {children}
    </label>
  )
}

function UploadDropzone() {
  return (
    <div className="mt-4 cursor-pointer rounded-lg border-2 border-dashed border-[#404040] bg-[#1a1a1a] p-8 text-center transition hover:bg-[#333333]">
      <PatientIcon className="mx-auto mb-3 size-6 text-[#a3a3a3]" name="upload" />
      <p className="text-sm font-medium text-[#e5e5e5]">Clique para selecionar arquivos ou arraste-os aqui</p>
      <p className="mt-1 text-xs text-[#a3a3a3]">Imagens e documentos ate 10MB</p>
    </div>
  )
}

function AdvancedFilterModal({
  ageMax,
  ageMin,
  city,
  lastVisitSince,
  onApply,
  onClear,
  onClose,
  setAgeMax,
  setAgeMin,
  setCity,
  setLastVisitSince,
  setState,
  state,
  stateOptions,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-[#404040] bg-[#262626] p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#e5e5e5]">Filtro Avancado</h2>
          <button className="rounded p-1 transition hover:bg-[#333333]" onClick={onClose} type="button">
            <PatientIcon className="size-5 text-[#a3a3a3]" name="x" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DarkField label="Cidade">
              <input
                className={darkInput}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Ex: Recife"
                value={city}
              />
            </DarkField>
            <DarkField label="Estado">
              <select className={darkInput} onChange={(event) => setState(event.target.value)} value={state}>
                <option value="">Todos</option>
                {stateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </DarkField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DarkField label="Idade minima">
              <input
                className={darkInput}
                min="0"
                onChange={(event) => setAgeMin(event.target.value)}
                placeholder="0"
                type="number"
                value={ageMin}
              />
            </DarkField>
            <DarkField label="Idade maxima">
              <input
                className={darkInput}
                min="0"
                onChange={(event) => setAgeMax(event.target.value)}
                placeholder="120"
                type="number"
                value={ageMax}
              />
            </DarkField>
          </div>
          <DarkField label="Ultimo atendimento desde">
            <input
              className={`${darkInput} [color-scheme:dark]`}
              onChange={(event) => setLastVisitSince(event.target.value)}
              type="date"
              value={lastVisitSince}
            />
          </DarkField>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg border border-[#404040] bg-[#262626] px-4 py-2 text-sm font-medium text-[#e5e5e5] transition hover:bg-[#333333]"
            onClick={onClear}
            type="button"
          >
            Limpar
          </button>
          <button
            className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2563eb]"
            onClick={onApply}
            type="button"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  )
}

function PatientIcon({ className = 'size-4', name }) {
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

  if (name === 'user-plus') {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
    )
  }

  if (name === 'filter') {
    return (
      <svg {...common}>
        <path d="M3 5h18M7 12h10M10 19h4" />
      </svg>
    )
  }

  if (name === 'star') {
    return (
      <svg {...common}>
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
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

  if (name === 'file') {
    return (
      <svg {...common}>
        <path d="M7 3h7l4 4v14H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </svg>
    )
  }

  if (name === 'more') {
    return (
      <svg {...common}>
        <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
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

  if (name === 'trash') {
    return (
      <svg {...common}>
        <path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6" />
      </svg>
    )
  }

  if (name === 'chevron-left') {
    return (
      <svg {...common}>
        <path d="m15 18-6-6 6-6" />
      </svg>
    )
  }

  if (name === 'chevron-right') {
    return (
      <svg {...common}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    )
  }

  if (name === 'chevron-up') {
    return (
      <svg {...common}>
        <path d="m18 15-6-6-6 6" />
      </svg>
    )
  }

  if (name === 'arrow-left') {
    return (
      <svg {...common}>
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    )
  }

  if (name === 'x') {
    return (
      <svg {...common}>
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    )
  }

  if (name === 'upload') {
    return (
      <svg {...common}>
        <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
      </svg>
    )
  }

  if (name === 'paperclip') {
    return (
      <svg {...common}>
        <path d="m21 12-8.5 8.5a5 5 0 0 1-7.1-7.1L14 4.8a3 3 0 0 1 4.2 4.2l-8.5 8.5a1 1 0 0 1-1.4-1.4L16 8.4" />
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

  if (name === 'trending') {
    return (
      <svg {...common}>
        <path d="m3 17 6-6 4 4 7-8" />
        <path d="M14 7h6v6" />
      </svg>
    )
  }

  if (name === 'alert') {
    return (
      <svg {...common}>
        <path d="M12 9v4M12 17h.01" />
        <path d="M10.3 4.3 2.7 18a2 2 0 0 0 1.8 3h15a2 2 0 0 0 1.8-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
      </svg>
    )
  }

  if (name === 'shield') {
    return (
      <svg {...common}>
        <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function buildPatientRows() {
  return patientRepository.getDirectoryRows()
}

function uniqueSlug(value, existingIds) {
  const base = slugify(value) || `paciente-${Date.now()}`
  let nextId = base
  let counter = 2

  while (existingIds.includes(nextId)) {
    nextId = `${base}-${counter}`
    counter += 1
  }

  return nextId
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function maskCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

function maskPhone(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

function maskCEPInput(event) {
  event.target.value = event.target.value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')
}
