import { useState } from 'react'

import { settingsRepository } from '../repositories/settingsRepository.js'


const cardClass = 'rounded-2xl border border-[#404040] bg-[#262626] shadow-sm'
const rowClass = 'flex items-center justify-between gap-6 border-b border-[#404040] py-4 last:border-0'
const inputClass =
  'h-10 rounded-sm border border-[#404040] bg-[#171717] px-3 text-sm text-[#e5e5e5] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20'

export function SettingsPage() {
  const sections = settingsRepository.getSections()
  const [activeSection, setActiveSection] = useState('aparencia')

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">Configurações</h1>
        <p className="mt-1 text-sm text-[#b8b8b8]">Gerencie preferências, segurança e integrações do MediConnect</p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <nav className="lg:w-64" aria-label="Seções de configuração">
          <div className={`${cardClass} flex flex-col gap-1 p-2`}>
            {sections.map((item) => (
              <button
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  activeSection === item.id
                    ? 'bg-[#3b82f6]/10 text-[#3b82f6]'
                    : 'text-[#a3a3a3] hover:bg-[#303030] hover:text-[#e5e5e5]'
                }`}
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                type="button"
              >
                <SettingsIcon className="size-4 shrink-0" name={item.icon} />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-none">{item.label}</span>
                  <span className="mt-1 block truncate text-[11px] opacity-70">{item.description}</span>
                </span>
              </button>
            ))}
          </div>
        </nav>

        <section className={`${cardClass} min-w-0 flex-1 p-6 lg:p-8`}>
          {activeSection === 'aparencia' ? <AppearanceSection /> : null}
          {activeSection === 'notificacoes' ? <NotificationsSection /> : null}
          {activeSection === 'privacidade' ? <PrivacySection /> : null}
          {activeSection === 'conta' ? <AccountSection /> : null}
          {activeSection === 'integracoes' ? <IntegrationsSection /> : null}
          {activeSection === 'dados' ? <DataSection /> : null}
        </section>
      </div>
    </div>
  )
}

function AppearanceSection() {
  const [theme, setTheme] = useState('dark')
  const [compact, setCompact] = useState(false)
  const [contrast, setContrast] = useState(false)
  const [animations, setAnimations] = useState(true)

  return (
    <SectionFrame description="Personalize a interface do MediConnect." title="Aparência">
      <div className="mb-8">
        <p className="mb-4 text-sm font-semibold text-[#e5e5e5]">Tema da Interface</p>
        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          {[
            { id: 'dark', label: 'Escuro', preview: 'bg-[#0a1628]' },
            { id: 'light', label: 'Claro', preview: 'bg-[#f4f7fb]' },
          ].map((item) => (
            <button
              className={`rounded-2xl border-2 p-4 text-left transition ${
                theme === item.id ? 'border-[#3b82f6] bg-[#3b82f6]/5 shadow-md shadow-[#3b82f6]/20' : 'border-[#404040] bg-[#262626] hover:border-[#3b82f6]/40'
              }`}
              key={item.id}
              onClick={() => setTheme(item.id)}
              type="button"
            >
              <span className={`mb-3 flex h-20 flex-col gap-1.5 overflow-hidden rounded-xl border border-[#404040] p-2 ${item.preview}`}>
                <span className={`h-2.5 rounded ${item.id === 'dark' ? 'bg-[#1a3050]' : 'bg-white'}`} />
                <span className="flex flex-1 gap-1">
                  <span className={`w-8 rounded ${item.id === 'dark' ? 'bg-[#0f1f36]' : 'bg-white'}`} />
                  <span className="flex flex-1 flex-col justify-center gap-1">
                    <span className={`h-1.5 w-3/4 rounded-full ${item.id === 'dark' ? 'bg-[#1e3a5f]' : 'bg-[#dde8f7]'}`} />
                    <span className={`h-1.5 w-1/2 rounded-full ${item.id === 'dark' ? 'bg-[#1e3a5f]' : 'bg-[#dde8f7]'}`} />
                  </span>
                </span>
              </span>
              <span className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#e5e5e5]">{item.label}</span>
                {theme === item.id ? <span className="grid size-5 place-items-center rounded-full bg-[#3b82f6] text-[11px] text-white">✓</span> : null}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#a3a3a3]">A preferência de tema é salva localmente neste protótipo.</p>
      </div>

      <SettingsGroup>
        <SettingRow description="Transições suaves entre telas e componentes" label="Animações de interface">
          <ToggleSwitch checked={animations} onChange={setAnimations} />
        </SettingRow>
        <SettingRow description="Aumenta o contraste dos elementos para melhor acessibilidade" label="Modo de alto contraste">
          <ToggleSwitch checked={contrast} onChange={setContrast} />
        </SettingRow>
        <SettingRow description="Reduz o espaçamento para exibir mais informações na tela" label="Densidade compacta">
          <ToggleSwitch checked={compact} onChange={setCompact} />
        </SettingRow>
        <SettingRow label="Idioma do sistema">
          <select className={inputClass} defaultValue="pt-br">
            <option value="pt-br">Português (BR)</option>
            <option value="en-us">English (US)</option>
            <option value="es">Español</option>
          </select>
        </SettingRow>
      </SettingsGroup>
    </SectionFrame>
  )
}

function NotificationsSection() {
  const [settings, setSettings] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    push: false,
    ai: true,
    appointment: true,
    financial: false,
    report: true,
    noShow: true,
  })

  return (
    <SectionFrame description="Configure como e quando deseja receber alertas." title="Notificações">
      <Subsection title="Canais de Comunicação">
        <ToggleRow checked={settings.email} description="Receba resumos e alertas via e-mail" label="Notificações por E-mail" onChange={(value) => setSettings((current) => ({ ...current, email: value }))} />
        <ToggleRow checked={settings.sms} description="Alertas urgentes via mensagem de texto" label="SMS" onChange={(value) => setSettings((current) => ({ ...current, sms: value }))} />
        <ToggleRow checked={settings.whatsapp} description="Integração com WhatsApp Business para lembretes" label="WhatsApp" onChange={(value) => setSettings((current) => ({ ...current, whatsapp: value }))} />
        <ToggleRow checked={settings.push} description="Notificações no navegador em tempo real" label="Push (navegador)" onChange={(value) => setSettings((current) => ({ ...current, push: value }))} />
      </Subsection>

      <Subsection title="Tipos de Alerta">
        <ToggleRow checked={settings.ai} description="Alerta preditivo quando paciente tem alto risco de faltar" label="Risco de No-Show (IA)" onChange={(value) => setSettings((current) => ({ ...current, ai: value }))} />
        <ToggleRow checked={settings.appointment} description="Lembre pacientes 24h e 1h antes da consulta" label="Lembrete de Consulta" onChange={(value) => setSettings((current) => ({ ...current, appointment: value }))} />
        <ToggleRow checked={settings.financial} description="Cobranças pendentes e inadimplências" label="Alertas Financeiros" onChange={(value) => setSettings((current) => ({ ...current, financial: value }))} />
        <ToggleRow checked={settings.report} description="Notificar quando relatórios mensais estiverem prontos" label="Relatório Disponível" onChange={(value) => setSettings((current) => ({ ...current, report: value }))} />
        <ToggleRow checked={settings.noShow} description="Confirmar quando uma falta é registrada no sistema" label="No-Show registrado" onChange={(value) => setSettings((current) => ({ ...current, noShow: value }))} />
      </Subsection>

      <Subsection title="Horário Silencioso">
        <SettingRow description="Sem notificações push entre 22h e 7h" label="Ativar horário silencioso">
          <ToggleSwitch checked onChange={() => {}} />
        </SettingRow>
        <SettingRow label="Horário de início / fim">
          <div className="flex items-center gap-2">
            <input className={`${inputClass} w-28`} defaultValue="22:00" type="time" />
            <span className="text-sm text-[#a3a3a3]">até</span>
            <input className={`${inputClass} w-28`} defaultValue="07:00" type="time" />
          </div>
        </SettingRow>
      </Subsection>
    </SectionFrame>
  )
}

function PrivacySection() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [audit, setAudit] = useState(true)
  const [anonymous, setAnonymous] = useState(false)

  return (
    <SectionFrame description="Gerencie conformidade com a Lei Geral de Proteção de Dados." title="Privacidade & LGPD">
      <div className="mb-6 flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <SettingsIcon className="mt-0.5 size-5 shrink-0 text-amber-400" name="alert" />
        <div>
          <p className="text-sm font-semibold text-amber-400">Conformidade LGPD Ativa</p>
          <p className="mt-1 text-xs leading-5 text-[#a3a3a3]">
            Dados de pacientes são tratados com finalidade legítima e armazenados com segurança neste protótipo.
          </p>
        </div>
      </div>

      <Subsection title="Segurança de Acesso">
        <ToggleRow checked={twoFactor} description="Adiciona uma camada extra de segurança ao login" label="Autenticação de Dois Fatores (2FA)" onChange={setTwoFactor} />
        <SettingRow description="Desconectar automaticamente após inatividade" label="Tempo de sessão">
          <select className={inputClass} defaultValue="30">
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
            <option value="240">4 horas</option>
          </select>
        </SettingRow>
        <ToggleRow checked={audit} description="Registrar todas as ações realizadas no sistema" label="Log de auditoria" onChange={setAudit} />
      </Subsection>

      <Subsection title="Dados dos Pacientes">
        <ToggleRow checked={anonymous} description="Ocultar dados pessoais identificáveis nos relatórios exportados" label="Anonimizar em relatórios" onChange={setAnonymous} />
        <SettingRow description="Período de armazenamento de dados inativos" label="Retenção de dados">
          <select className={inputClass} defaultValue="5">
            <option value="1">1 ano</option>
            <option value="3">3 anos</option>
            <option value="5">5 anos (padrão)</option>
            <option value="10">10 anos</option>
          </select>
        </SettingRow>
        <SettingRow description="Gerar relatório completo para atender solicitação de titular" label="Exportar dados do paciente">
          <button className="h-9 rounded-sm border border-[#404040] bg-[#303030] px-3 text-sm font-semibold text-[#e5e5e5]" type="button">
            Exportar
          </button>
        </SettingRow>
      </Subsection>
    </SectionFrame>
  )
}

function AccountSection() {
  const [profile, setProfile] = useState({
    name: 'Dra. Ana Silva',
    email: 'ana.silva@mediconnect.com.br',
    role: 'Coordenação Médica',
    crm: 'CRM/SE 12345',
  })

  function update(field, value) {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  return (
    <SectionFrame description="Gerencie suas informações pessoais e credenciais." title="Conta & Perfil">
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-[#404040] bg-[#171717] p-5">
        <div className="grid size-16 place-items-center rounded-full border-2 border-[#3b82f6]/20 bg-[#3b82f6]/10 text-xl font-bold text-[#3b82f6]">
          AS
        </div>
        <div>
          <p className="text-sm font-bold text-[#f5f5f5]">{profile.name}</p>
          <p className="text-xs text-[#a3a3a3]">{profile.role}</p>
          <button className="mt-1 text-xs font-semibold text-[#3b82f6]" type="button">
            Alterar foto
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Nome completo" onChange={(value) => update('name', value)} value={profile.name} />
        <TextField label="E-mail" onChange={(value) => update('email', value)} value={profile.email} />
        <TextField label="Cargo / Função" onChange={(value) => update('role', value)} value={profile.role} />
        <TextField label="CRM / Registro" onChange={(value) => update('crm', value)} value={profile.crm} />
      </div>

      <Subsection title="Segurança">
        <SettingRow description="Última alteração há 45 dias" label="Alterar senha">
          <button className="h-9 rounded-sm border border-[#404040] bg-[#303030] px-3 text-sm font-semibold text-[#e5e5e5]" type="button">
            Alterar
          </button>
        </SettingRow>
        <SettingRow description="Gerenciar dispositivos conectados" label="Sessões ativas">
          <button className="text-sm font-semibold text-[#3b82f6]" type="button">
            Ver sessões
          </button>
        </SettingRow>
      </Subsection>
    </SectionFrame>
  )
}

function IntegrationsSection() {
  const integrations = settingsRepository.getIntegrations()

  return (
    <SectionFrame description="Conecte o MediConnect com sistemas e serviços externos." title="Integrações">
      <div className="space-y-3">
        {integrations.map(([name, desc, connected, color]) => (
          <div className="flex items-center gap-4 rounded-xl border border-[#404040] bg-[#171717] p-4" key={name}>
            <div className={`grid size-10 shrink-0 place-items-center rounded-lg ${color}`}>
              <SettingsIcon className="size-5 text-white" name="globe" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#f5f5f5]">{name}</p>
              <p className="text-xs text-[#a3a3a3]">{desc}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${connected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#303030] text-[#a3a3a3]'}`}>
              {connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        ))}
      </div>
    </SectionFrame>
  )
}

function DataSection() {
  return (
    <SectionFrame description="Exporte, importe e gerencie backups do sistema." title="Dados & Backup">
      <Subsection title="Exportação de Dados">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['Pacientes (CSV)', 'Lista completa com dados cadastrais'],
            ['Prontuários (PDF)', 'Registros médicos do período'],
            ['Financeiro (Excel)', 'Lançamentos e faturamento'],
            ['Relatório Geral (PDF)', 'Dashboard executivo completo'],
          ].map(([label, desc]) => (
            <button className="flex items-center gap-3 rounded-xl border border-[#404040] bg-[#171717] p-4 text-left transition hover:border-[#3b82f6]/40" key={label} type="button">
              <span className="grid size-9 place-items-center rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                <SettingsIcon className="size-4" name="download" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[#f5f5f5]">{label}</span>
                <span className="block text-xs text-[#a3a3a3]">{desc}</span>
              </span>
            </button>
          ))}
        </div>
      </Subsection>

      <Subsection title="Backup Automático">
        <SettingRow description="Salvar snapshot diário dos dados" label="Backup automático">
          <ToggleSwitch checked onChange={() => {}} />
        </SettingRow>
        <SettingRow description="Com que frequência o backup é realizado" label="Frequência">
          <select className={inputClass} defaultValue="daily">
            <option value="daily">Diário (00h)</option>
            <option value="12h">A cada 12h</option>
            <option value="weekly">Semanal</option>
          </select>
        </SettingRow>
        <SettingRow description="30/03/2026 às 00:15" label="Último backup">
          <button className="h-9 rounded-sm border border-[#404040] bg-[#303030] px-3 text-sm font-semibold text-[#e5e5e5]" type="button">
            Baixar
          </button>
        </SettingRow>
      </Subsection>
    </SectionFrame>
  )
}

function SectionFrame({ children, description, title }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#f5f5f5]">{title}</h2>
        <p className="mt-1 text-sm text-[#a3a3a3]">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  )
}

function Subsection({ children, title }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#a3a3a3]">{title}</p>
      <SettingsGroup>{children}</SettingsGroup>
    </div>
  )
}

function SettingsGroup({ children }) {
  return <div className="rounded-xl border border-[#404040] bg-[#171717] px-6">{children}</div>
}

function ToggleRow({ checked, description, label, onChange }) {
  return (
    <SettingRow description={description} label={label}>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </SettingRow>
  )
}

function SettingRow({ children, description, label }) {
  return (
    <div className={rowClass}>
      <div className="min-w-0 flex-1 pr-4">
        <p className="text-sm font-semibold text-[#e5e5e5]">{label}</p>
        {description ? <p className="mt-1 text-xs leading-5 text-[#a3a3a3]">{description}</p> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function TextField({ label, onChange, value }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold text-[#a3a3a3]">{label}</span>
      <input className={`${inputClass} w-full`} onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  )
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      aria-checked={checked}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? 'bg-[#3b82f6]' : 'bg-[#303030]'}`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span className={`inline-block size-4 rounded-full bg-white shadow-md transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

function SettingsIcon({ className = 'size-4', name }) {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.9,
    viewBox: '0 0 24 24',
  }

  if (name === 'bell') {
    return (
      <svg {...common}>
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    )
  }

  if (name === 'shield') {
    return (
      <svg {...common}>
        <path d="M12 3 5 6v5c0 4 3 7.5 7 10 4-2.5 7-6 7-10V6l-7-3Z" />
      </svg>
    )
  }

  if (name === 'user') {
    return (
      <svg {...common}>
        <path d="M16 19a4 4 0 0 0-8 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      </svg>
    )
  }

  if (name === 'globe') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
      </svg>
    )
  }

  if (name === 'database') {
    return (
      <svg {...common}>
        <ellipse cx="12" cy="5" rx="7" ry="3" />
        <path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
      </svg>
    )
  }

  if (name === 'download') {
    return (
      <svg {...common}>
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
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

  return (
    <svg {...common}>
      <path d="M12 3v3M12 18v3M4.9 4.9 7 7M17 17l2.1 2.1M3 12h3M18 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
