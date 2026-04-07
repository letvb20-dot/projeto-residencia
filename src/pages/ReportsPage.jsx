import { useMemo, useState } from 'react'

import { reportRepository } from '../repositories/reportRepository.js'


const statusConfig = {
  rascunho: {
    label: 'Rascunho',
    pill: 'bg-amber-500/20 text-amber-400',
    stat: 'text-amber-400',
  },
  finalizado: {
    label: 'Finalizado',
    pill: 'bg-emerald-500/20 text-emerald-400',
    stat: 'text-emerald-400',
  },
  enviado: {
    label: 'Enviado',
    pill: 'bg-blue-500/20 text-blue-400',
    stat: 'text-blue-400',
  },
}

const adminUsers = reportRepository.getAdminUsers()
const currentUser = reportRepository.getCurrentUser()
const doctors = reportRepository.getDoctors()
const reportTypes = reportRepository.getReportTypes()
const templates = reportRepository.getTemplates()
const emptyEditor = {
  id: null,
  type: reportTypes[0],
  patient: '',
  doctor: doctors[0],
  content: '',
  showDate: true,
  signDigital: true,
}


const inputClass =
  'h-10 w-full rounded-lg border border-[#404040] bg-[#1a1a1a] px-3 text-sm text-[#e5e5e5] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]'
const labelClass = 'mb-1.5 block text-xs font-medium text-[#e5e5e5]'
const cardClass = 'rounded-2xl border border-[#404040] bg-[#262626] shadow-sm'

export function ReportsPage() {
  const [reports, setReports] = useState(() => reportRepository.getInitialReports())
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [historyReport, setHistoryReport] = useState(null)
  const [confirmRelease, setConfirmRelease] = useState(null)
  const [deliveryReport, setDeliveryReport] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [preview, setPreview] = useState(false)
  const [editor, setEditor] = useState(emptyEditor)

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = [report.patient, report.type]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesStatus = !filterStatus || report.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [filterStatus, reports, search])

  const stats = [
    { label: 'Rascunhos', status: 'rascunho' },
    { label: 'Finalizados', status: 'finalizado' },
    { label: 'Enviados', status: 'enviado' },
  ].map((stat) => ({
    ...stat,
    value: reports.filter((report) => report.status === stat.status).length,
  }))

  function openNew(template = null) {
    setEditor({
      ...emptyEditor,
      type: template?.type || emptyEditor.type,
      content: template?.content || '',
    })
    setPreview(false)
    setTemplatesOpen(false)
    setEditorOpen(true)
  }

  function openEdit(report) {
    setEditor({
      id: report.id,
      type: report.type,
      patient: report.patient,
      doctor: report.doctor,
      content: report.content,
      showDate: report.showDate,
      signDigital: report.signDigital,
    })
    setOpenMenuId(null)
    setPreview(false)
    setEditorOpen(true)
  }

  function saveReport(status) {
    if (!editor.patient.trim() || !editor.content.trim()) {
      return
    }

    const date = new Date().toLocaleDateString('pt-BR')
    setReports((currentReports) => {
      if (editor.id) {
        return currentReports.map((report) =>
          report.id === editor.id
            ? {
                ...report,
                type: editor.type,
                patient: editor.patient,
                doctor: editor.doctor,
                content: editor.content,
                showDate: editor.showDate,
                signDigital: editor.signDigital,
                status,
                versions: [
                  ...report.versions,
                  {
                    version: report.versions.length + 1,
                    action: status === 'finalizado' ? 'Liberado' : 'Rascunho',
                    user: currentUser,
                    summary: status === 'finalizado' ? 'Laudo liberado' : 'Rascunho salvo',
                  },
                ],
              }
            : report,
        )
      }

      return [
        {
          id: `report-${Date.now()}`,
          type: editor.type,
          patient: editor.patient,
          doctor: editor.doctor,
          date,
          status,
          content: editor.content,
          showDate: editor.showDate,
          signDigital: editor.signDigital,
          versions: [
            { version: 1, action: 'Criado', user: currentUser, summary: 'Laudo criado localmente' },
            {
              version: 2,
              action: status === 'finalizado' ? 'Liberado' : 'Rascunho',
              user: currentUser,
              summary: status === 'finalizado' ? 'Laudo liberado' : 'Rascunho salvo',
            },
          ],
        },
        ...currentReports,
      ]
    })
    setEditorOpen(false)
  }

  function releaseReport(reportId) {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: 'finalizado',
              versions: [
                ...report.versions,
                { version: report.versions.length + 1, action: 'Liberado', user: currentUser, summary: 'Laudo liberado' },
              ],
            }
          : report,
      ),
    )
    setConfirmRelease(null)
  }

  function sendReport(reportId) {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: 'enviado',
              versions: [
                ...report.versions,
                { version: report.versions.length + 1, action: 'Enviado', user: currentUser, summary: 'Laudo enviado ao paciente' },
              ],
            }
          : report,
      ),
    )
    setOpenMenuId(null)
  }

  function deleteReport(reportId) {
    setReports((currentReports) => currentReports.filter((report) => report.id !== reportId))
    setConfirmDelete(null)
    setDeleteConfirmText('')
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-[#e5e5e5]">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#e5e5e5]">Gestão de Laudos</h1>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#404040] bg-[#262626] px-4 text-sm font-medium text-[#e5e5e5] transition hover:bg-[#2a2a2a]"
            onClick={() => setTemplatesOpen(true)}
            type="button"
          >
            <ReportIcon className="size-4 text-[#3b82f6]" name="template" />
            Templates
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#3b82f6] px-4 text-sm font-medium text-white transition hover:bg-[#2563eb]"
            onClick={() => openNew()}
            type="button"
          >
            <ReportIcon name="plus" />
            Novo Laudo
          </button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div className={`${cardClass} p-4`} key={stat.status}>
            <p className="text-xs font-semibold text-[#a3a3a3]">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${statusConfig[stat.status].stat}`}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section className={`${cardClass} p-6`}>
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <ReportIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a3a3a3]" name="search" />
            <input
              className="h-10 w-full rounded-none border border-[#404040] bg-[#1a1a1a] py-2 pl-10 pr-3 text-sm text-[#e5e5e5] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por paciente ou tipo..."
              value={search}
            />
          </div>
          <select
            className="h-10 rounded-none border border-[#404040] bg-[#1a1a1a] px-3 text-sm font-semibold text-[#e5e5e5] outline-none transition focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            onChange={(event) => setFilterStatus(event.target.value)}
            value={filterStatus}
          >
            <option value="">Todos os Status</option>
            <option value="rascunho">Rascunho</option>
            <option value="finalizado">Finalizado</option>
            <option value="enviado">Enviado</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-none border border-[#404040]">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="bg-[#171717] text-xs font-semibold uppercase text-[#a3a3a3]">
              <tr>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Paciente</th>
                <th className="px-4 py-3">Médico</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Versões</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#404040] bg-[#262626]">
              {filteredReports.length ? (
                filteredReports.map((report) => (
                  <ReportRow
                    key={report.id}
                    onDelete={() => {
                      setConfirmDelete({ report })
                      setDeleteConfirmText('')
                      setOpenMenuId(null)
                    }}
                    onDelivery={() => {
                      setDeliveryReport(report)
                      setOpenMenuId(null)
                    }}
                    onEdit={() => openEdit(report)}
                    onHistory={() => {
                      setHistoryReport(report)
                      setOpenMenuId(null)
                    }}
                    onPrint={() => {
                      window.print()
                      setOpenMenuId(null)
                    }}
                    onRelease={() => {
                      setConfirmRelease(report)
                      setOpenMenuId(null)
                    }}
                    onSend={() => sendReport(report.id)}
                    open={openMenuId === report.id}
                    report={report}
                    setOpenMenuId={setOpenMenuId}
                  />
                ))
              ) : (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-[#a3a3a3]" colSpan={7}>
                    Nenhum laudo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {templatesOpen ? <TemplatesModal onClose={() => setTemplatesOpen(false)} onUseTemplate={openNew} /> : null}
      {historyReport ? <HistoryModal onClose={() => setHistoryReport(null)} report={historyReport} /> : null}
      {deliveryReport ? <DeliveryModal onClose={() => setDeliveryReport(null)} report={deliveryReport} /> : null}
      {confirmRelease ? (
        <ConfirmReleaseModal
          onClose={() => setConfirmRelease(null)}
          onConfirm={() => releaseReport(confirmRelease.id)}
          report={confirmRelease}
        />
      ) : null}
      {confirmDelete ? (
        <DeleteModal
          confirmText={deleteConfirmText}
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => deleteReport(confirmDelete.report.id)}
          report={confirmDelete.report}
          setConfirmText={setDeleteConfirmText}
        />
      ) : null}
      {editorOpen ? (
        <ReportEditorModal
          editor={editor}
          onClose={() => setEditorOpen(false)}
          onSave={saveReport}
          preview={preview}
          setEditor={setEditor}
          setPreview={setPreview}
        />
      ) : null}
    </div>
  )
}

function ReportRow({
  onDelete,
  onDelivery,
  onEdit,
  onHistory,
  onPrint,
  onRelease,
  onSend,
  open,
  report,
  setOpenMenuId,
}) {
  return (
    <tr className="transition hover:bg-[#303030]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <ReportIcon className="size-4 text-[#3b82f6]" name="file" />
          <span className="font-medium text-[#e5e5e5]">{report.type}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-[#e5e5e5]">{report.patient}</td>
      <td className="px-4 py-3 text-[#a3a3a3]">{report.doctor}</td>
      <td className="px-4 py-3 text-[#a3a3a3]">{report.date}</td>
      <td className="px-4 py-3">
        <span className={`rounded px-2 py-1 text-[10px] font-bold ${statusConfig[report.status].pill}`}>
          {statusConfig[report.status].label}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          className="inline-flex items-center gap-1.5 rounded-md bg-[#2a2a2a] px-2 py-1 text-xs font-medium text-[#a3a3a3] transition hover:bg-[#3b82f6]/10 hover:text-[#3b82f6]"
          onClick={onHistory}
          title="Ver histórico de versões"
          type="button"
        >
          <ReportIcon className="size-3.5" name="history" />
          v{report.versions.length}
        </button>
      </td>
      <td className="relative px-4 py-3 text-right">
        <button
          aria-label={`Ações de ${report.type} de ${report.patient}`}
          className="rounded p-1 text-[#a3a3a3] transition hover:bg-[#2a2a2a] hover:text-[#e5e5e5]"
          onClick={() => setOpenMenuId(open ? null : report.id)}
          type="button"
        >
          <ReportIcon className="size-5" name="more" />
        </button>
        {open ? (
          <>
            <button
              aria-label="Fechar menu"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setOpenMenuId(null)}
              type="button"
            />
            <div className="absolute right-8 top-10 z-20 w-56 rounded-lg border border-[#404040] bg-[#303030] py-1 text-left shadow-lg">
              <MenuItem icon="edit" label="Editar" onClick={onEdit} />
              <MenuItem icon="history" label="Histórico de Versões" onClick={onHistory} />
              <MenuItem icon="printer" label="Imprimir" onClick={onPrint} />
              {(report.status === 'finalizado' || report.status === 'enviado') ? (
                <MenuItem icon="clipboard" label="Protocolo de Entrega" onClick={onDelivery} />
              ) : null}
              <div className="my-1 border-t border-[#404040]" />
              {report.status === 'rascunho' ? <MenuItem icon="check" label="Liberar Laudo" onClick={onRelease} tone="green" /> : null}
              {report.status === 'finalizado' ? <MenuItem icon="send" label="Enviar ao Paciente" onClick={onSend} tone="blue" /> : null}
              <div className="my-1 border-t border-[#404040]" />
              {canDelete(report) ? (
                <MenuItem icon="trash" label="Excluir" onClick={onDelete} tone="danger" />
              ) : (
                <div className="flex w-full cursor-not-allowed items-center gap-2 px-4 py-2 text-sm text-[#737373]">
                  <ReportIcon className="size-4" name="shield-off" />
                  Excluir
                  <span className="ml-auto rounded bg-[#2a2a2a] px-1.5 py-0.5 text-[10px]">Sem permissão</span>
                </div>
              )}
            </div>
          </>
        ) : null}
      </td>
    </tr>
  )
}

function ReportEditorModal({ editor, onClose, onSave, preview, setEditor, setPreview }) {
  const isValid = editor.patient.trim() && editor.content.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-[#404040] bg-[#262626] shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#404040] px-6 py-4">
          <h2 className="text-lg font-bold text-[#e5e5e5]">{editor.id ? 'Editar Laudo' : 'Novo Laudo'}</h2>
          <div className="flex items-center gap-2">
            <button
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition ${
                preview
                  ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]'
                  : 'border-[#404040] text-[#a3a3a3] hover:bg-[#2a2a2a]'
              }`}
              onClick={() => setPreview((current) => !current)}
              type="button"
            >
              <ReportIcon className="size-3.5" name="eye" />
              {preview ? 'Editar' : 'Pré-visualizar'}
            </button>
            <button className="rounded-lg p-1.5 transition hover:bg-[#2a2a2a]" onClick={onClose} type="button">
              <ReportIcon className="size-4 text-[#a3a3a3]" name="x" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {preview ? (
            <div className="min-h-[400px] rounded-xl bg-white p-8 text-gray-900 shadow-inner">
              <div className="mb-6 border-b border-gray-200 pb-4 text-center">
                <h3 className="text-xl font-bold">{editor.type}</h3>
                {editor.showDate ? <p className="mt-1 text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p> : null}
              </div>
              <p className="text-sm"><strong>Paciente:</strong> {editor.patient || '-'}</p>
              <p className="mt-1 text-sm"><strong>Médico(a):</strong> {editor.doctor}</p>
              <p className="mt-6 whitespace-pre-wrap text-sm leading-6">
                {editor.content || 'Nenhum conteúdo inserido.'}
              </p>
              {editor.signDigital ? (
                <div className="mt-12 border-t border-gray-200 pt-6 text-center">
                  <p className="text-sm font-medium text-gray-700">{editor.doctor}</p>
                  <p className="mt-1 text-xs text-gray-400">Assinatura Digital - MediConnect</p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <DarkField label="Tipo de Laudo *">
                  <select className={inputClass} onChange={(event) => setEditorValue(setEditor, 'type', event.target.value)} value={editor.type}>
                    {reportTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </DarkField>
                <DarkField label="Paciente *">
                  <input
                    className={inputClass}
                    onChange={(event) => setEditorValue(setEditor, 'patient', event.target.value)}
                    placeholder="Digite o nome do paciente..."
                    value={editor.patient}
                  />
                </DarkField>
              </div>
              <DarkField label="Médico Responsável">
                <select className={inputClass} onChange={(event) => setEditorValue(setEditor, 'doctor', event.target.value)} value={editor.doctor}>
                  {doctors.map((doctor) => (
                    <option key={doctor}>{doctor}</option>
                  ))}
                </select>
              </DarkField>
              <DarkField label="Conteúdo *">
                <textarea
                  className={`${inputClass} min-h-72 py-3 leading-6`}
                  onChange={(event) => setEditorValue(setEditor, 'content', event.target.value)}
                  placeholder="Digite o conteúdo do laudo aqui..."
                  value={editor.content}
                />
              </DarkField>
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[#e5e5e5]">
                  <input
                    checked={editor.showDate}
                    className="size-4 accent-[#3b82f6]"
                    onChange={(event) => setEditorValue(setEditor, 'showDate', event.target.checked)}
                    type="checkbox"
                  />
                  Exibir data no laudo
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[#e5e5e5]">
                  <input
                    checked={editor.signDigital}
                    className="size-4 accent-[#3b82f6]"
                    onChange={(event) => setEditorValue(setEditor, 'signDigital', event.target.checked)}
                    type="checkbox"
                  />
                  Incluir assinatura digital
                </label>
              </div>
              {!isValid ? <p className="text-xs text-amber-400">* Preencha o paciente e o conteúdo do laudo para salvar.</p> : null}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#404040] px-6 py-4">
          <button
            className="rounded-lg border border-[#404040] bg-[#262626] px-4 py-2 text-sm font-medium text-[#e5e5e5] transition hover:bg-[#2a2a2a]"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <div className="flex gap-3">
            <button
              className="rounded-lg border border-[#404040] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-[#e5e5e5] transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!isValid}
              onClick={() => onSave('rascunho')}
              type="button"
            >
              Salvar Rascunho
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!isValid}
              onClick={() => onSave('finalizado')}
              type="button"
            >
              <ReportIcon className="size-3.5" name="lock" />
              Liberar Laudo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplatesModal({ onClose, onUseTemplate }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl rounded-2xl border border-[#404040] bg-[#262626] p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#e5e5e5]">Templates de Laudo</h2>
            <p className="mt-1 text-xs text-[#a3a3a3]">Modelos locais para acelerar a escrita do laudo.</p>
          </div>
          <button className="rounded-lg p-1.5 transition hover:bg-[#2a2a2a]" onClick={onClose} type="button">
            <ReportIcon className="size-4 text-[#a3a3a3]" name="x" />
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {templates.map((template) => (
            <button
              className="rounded-xl border border-[#404040] bg-[#1a1a1a] p-4 text-left transition hover:border-[#3b82f6]/50 hover:bg-[#2a2a2a]"
              key={template.id}
              onClick={() => onUseTemplate(template)}
              type="button"
            >
              <p className="text-sm font-bold text-[#e5e5e5]">{template.name}</p>
              <p className="mt-1 text-xs font-medium text-[#3b82f6]">{template.type}</p>
              <p className="mt-3 text-xs leading-5 text-[#a3a3a3]">{template.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function HistoryModal({ onClose, report }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-[#404040] bg-[#262626] p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#e5e5e5]">Histórico de Versões</h2>
            <p className="mt-1 text-xs text-[#a3a3a3]">{report.type} - {report.patient}</p>
          </div>
          <button className="rounded-lg p-1.5 transition hover:bg-[#2a2a2a]" onClick={onClose} type="button">
            <ReportIcon className="size-4 text-[#a3a3a3]" name="x" />
          </button>
        </div>
        <div className="space-y-3">
          {[...report.versions].reverse().map((version) => (
            <div className="rounded-xl border border-[#404040] bg-[#1a1a1a] p-4" key={version.version}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-[#e5e5e5]">v{version.version} - {version.action}</p>
                <p className="text-xs text-[#a3a3a3]">{version.user}</p>
              </div>
              <p className="mt-2 text-xs text-[#a3a3a3]">{version.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ConfirmReleaseModal({ onClose, onConfirm, report }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-[#404040] bg-[#262626] p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
            <ReportIcon className="size-5" name="check" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#e5e5e5]">Liberar Laudo?</h3>
            <p className="mt-0.5 text-xs text-[#a3a3a3]">{report.type} - {report.patient}</p>
          </div>
        </div>
        <p className="mb-5 text-sm leading-6 text-[#a3a3a3]">
          Ao liberar, o laudo ficará com status <strong className="text-emerald-400">Finalizado</strong> e poderá ser impresso ou enviado.
        </p>
        <div className="flex justify-end gap-3">
          <button className="rounded-lg border border-[#404040] px-4 py-2 text-sm text-[#e5e5e5] transition hover:bg-[#2a2a2a]" onClick={onClose} type="button">
            Cancelar
          </button>
          <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600" onClick={onConfirm} type="button">
            Confirmar Liberação
          </button>
        </div>
      </div>
    </div>
  )
}

function DeliveryModal({ onClose, report }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-[#404040] bg-[#262626] p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-lg font-bold text-[#e5e5e5]">Protocolo de Entrega</h2>
        <p className="mt-2 text-sm leading-6 text-[#a3a3a3]">
          Entrega mockada para {report.patient}, referente a {report.type} de {report.date}.
        </p>
        <div className="mt-5 grid gap-3">
          <DarkField label="Canal">
            <select className={inputClass} defaultValue="Portal do paciente">
              <option>Portal do paciente</option>
              <option>E-mail</option>
              <option>Impresso</option>
            </select>
          </DarkField>
          <DarkField label="Observação">
            <textarea className={`${inputClass} min-h-20 py-2`} placeholder="Observação local do protocolo..." />
          </DarkField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg border border-[#404040] px-4 py-2 text-sm text-[#e5e5e5] transition hover:bg-[#2a2a2a]" onClick={onClose} type="button">
            Cancelar
          </button>
          <button className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2563eb]" onClick={onClose} type="button">
            Registrar Protocolo
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteModal({ confirmText, onClose, onConfirm, report, setConfirmText }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-[#404040] bg-[#262626] p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-[#ef4444]/10 p-2 text-[#ef4444]">
            <ReportIcon className="size-5" name="trash" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#e5e5e5]">Excluir laudo?</h3>
            <p className="mt-0.5 text-xs text-[#a3a3a3]">{report.type} - {report.patient}</p>
          </div>
        </div>
        <p className="mb-3 text-sm leading-6 text-[#a3a3a3]">Para confirmar, digite EXCLUIR no campo abaixo.</p>
        <input
          autoFocus
          className="mb-4 h-10 w-full rounded-lg border border-[#ef4444]/40 bg-[#1a1a1a] px-3 text-sm text-[#e5e5e5] outline-none focus:border-[#ef4444]"
          onChange={(event) => setConfirmText(event.target.value)}
          placeholder="Digite EXCLUIR"
          value={confirmText}
        />
        <div className="flex justify-end gap-3">
          <button className="rounded-lg border border-[#404040] px-4 py-2 text-sm text-[#e5e5e5] transition hover:bg-[#2a2a2a]" onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            className="rounded-lg bg-[#ef4444] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={confirmText !== 'EXCLUIR'}
            onClick={onConfirm}
            type="button"
          >
            Excluir Permanentemente
          </button>
        </div>
      </div>
    </div>
  )
}

function MenuItem({ icon, label, onClick, tone = 'default' }) {
  const colors = {
    blue: 'text-blue-400 hover:bg-blue-500/10',
    danger: 'text-[#ef4444] hover:bg-[#ef4444]/10',
    default: 'text-[#e5e5e5] hover:bg-[#2a2a2a]',
    green: 'text-emerald-400 hover:bg-emerald-500/10',
  }

  return (
    <button className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition ${colors[tone]}`} onClick={onClick} type="button">
      <ReportIcon className="size-4" name={icon} />
      {label}
    </button>
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

function setEditorValue(setEditor, key, value) {
  setEditor((currentEditor) => ({ ...currentEditor, [key]: value }))
}

function canDelete(report) {
  return adminUsers.includes(currentUser) || (report.status === 'rascunho' && report.doctor === currentUser)
}

function ReportIcon({ className = 'size-4', name }) {
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

  if (name === 'template') {
    return (
      <svg {...common}>
        <path d="M4 5h16M4 12h7M13 12h7M4 19h16" />
        <path d="M4 5v14M20 5v14M11 12v7M13 12V5" />
      </svg>
    )
  }

  if (name === 'history') {
    return (
      <svg {...common}>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 4v4h4M12 7v5l3 2" />
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

  if (name === 'printer') {
    return (
      <svg {...common}>
        <path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
        <path d="M7 14h10v7H7zM17 12h.01" />
      </svg>
    )
  }

  if (name === 'clipboard') {
    return (
      <svg {...common}>
        <path d="M9 5h6M9 5a3 3 0 0 1 6 0M8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2M8 13h8M8 17h5" />
      </svg>
    )
  }

  if (name === 'check') {
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    )
  }

  if (name === 'send') {
    return (
      <svg {...common}>
        <path d="m22 2-7 20-4-9-9-4 20-7Z" />
        <path d="M22 2 11 13" />
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

  if (name === 'shield-off') {
    return (
      <svg {...common}>
        <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 1.1-.4 2.1-1 3-1.7M19 13.5V6l-7-3-4.2 1.8M3 3l18 18" />
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

  if (name === 'x') {
    return (
      <svg {...common}>
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    )
  }

  if (name === 'lock') {
    return (
      <svg {...common}>
        <rect height="10" rx="2" width="16" x="4" y="11" />
        <path d="M8 11V8a4 4 0 1 1 8 0v3" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
