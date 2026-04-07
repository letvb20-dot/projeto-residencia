import { useState } from 'react'

import { profileRepository } from '../repositories/profileRepository.js'

const cardClass = 'rounded-2xl border border-[#404040] bg-[#262626] shadow-sm'
const inputClass =
  'h-10 rounded-sm border border-[#404040] bg-[#171717] px-3 text-sm text-[#e5e5e5] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20'

export function ProfilePage() {
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState(() => profileRepository.getCurrentUserProfile())

  function update(field, value) {
    setSaved(false)
    setProfile((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">Perfil</h1>
        <p className="mt-1 text-sm text-[#b8b8b8]">Dados locais do usuário logado e preferências básicas do shell.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className={`${cardClass} p-6`}>
          <div className="mb-6 flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-xl font-bold text-[#3b82f6]">
              HC
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#f5f5f5]">{profile.name}</h2>
              <p className="mt-1 text-sm text-[#a3a3a3]">{profile.role}</p>
              <button className="mt-1 text-xs font-semibold text-[#3b82f6]" type="button">
                Alterar foto
              </button>
            </div>
          </div>

          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              setSaved(true)
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome">
                <input className={inputClass} onChange={(event) => update('name', event.target.value)} value={profile.name} />
              </Field>
              <Field label="Cargo">
                <input className={inputClass} onChange={(event) => update('role', event.target.value)} value={profile.role} />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="E-mail">
                <input className={inputClass} onChange={(event) => update('email', event.target.value)} type="email" value={profile.email} />
              </Field>
              <Field label="Telefone">
                <input className={inputClass} onChange={(event) => update('phone', event.target.value)} value={profile.phone} />
              </Field>
            </div>
            <Field label="Unidade padrão">
              <select className={inputClass} onChange={(event) => update('unit', event.target.value)} value={profile.unit}>
                <option>Clínica Boa Vista</option>
                <option>Unidade Centro</option>
                <option>Unidade Sul</option>
              </select>
            </Field>
            <div className="flex flex-wrap items-center gap-3">
              <button className="h-10 rounded-sm bg-[#3b82f6] px-4 text-sm font-semibold text-white" type="submit">
                Salvar alterações
              </button>
              {saved ? <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400">Preferências salvas localmente</span> : null}
            </div>
          </form>
        </section>

        <aside className={`${cardClass} p-6`}>
          <h2 className="text-xl font-bold text-[#f5f5f5]">Resumo de acesso</h2>
          <dl className="mt-5 grid gap-4 text-sm">
            <Info label="Perfil" value="Administrador da clínica" />
            <Info label="Último acesso" value="07 abr 2026, 09:15" />
            <Info label="Permissões" value="Agenda, pacientes, comunicação e configurações" />
          </dl>
        </aside>
      </div>
    </div>
  )
}

function Field({ children, label }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold text-[#a3a3a3]">{label}</span>
      {children}
    </label>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-[#404040] bg-[#171717] p-4">
      <dt className="font-semibold text-[#a3a3a3]">{label}</dt>
      <dd className="mt-1 text-[#e5e5e5]">{value}</dd>
    </div>
  )
}
