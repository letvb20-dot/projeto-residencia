import { useMemo, useState } from 'react'

import { BrandLogo } from './Brand.jsx'

const navItems = [
  { href: '/inicio', label: 'Painel', icon: 'pulse', activePaths: ['/inicio', '/home', '/dashboard'] },
  { href: '/agenda', label: 'Agenda', icon: 'calendar' },
  { href: '/pacientes', label: 'Pacientes', icon: 'users', exact: true },
  { href: '/prontuario', label: 'Prontuário', icon: 'file' },
  { href: '/laudos', label: 'Laudos', icon: 'clipboard' },
  {
    href: '/camunicacao',
    label: 'Comunicação',
    icon: 'message',
    activePaths: ['/camunicacao', '/comunicacao', '/mensagens'],
  },
  { href: '/financeiro', label: 'Financeiro', icon: 'dollar' },
  { href: '/relatorios', label: 'Relatórios', icon: 'chart' },
  { href: '/configuracoes', label: 'Configurações', icon: 'settings', activePaths: ['/configuracoes', '/config'] },
]

const titles = {
  '/inicio': 'Painel',
  '/home': 'Painel',
  '/dashboard': 'Painel',
  '/agenda': 'Agenda',
  '/consultas': 'Consultas',
  '/laudos': 'Laudos',
  '/pacientes': 'Pacientes',
  '/prontuario': 'Prontuário',
  '/camunicacao': 'Comunicação',
  '/comunicacao': 'Comunicação',
  '/mensagens': 'Comunicação',
  '/financeiro': 'Financeiro',
  '/relatorios': 'Relatórios',
  '/profissionais': 'Profissionais',
  '/perfil': 'Perfil',
  '/configuracoes': 'Configurações',
  '/config': 'Configurações',
}

export function AppShell({ children, currentPath, navigate, routeTitle }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [quickSearch, setQuickSearch] = useState('')

  const pageTitle = useMemo(() => {
    if (currentPath.startsWith('/pacientes/') && routeTitle) {
      return routeTitle
    }

    return routeTitle || titles[currentPath] || 'MediConnect'
  }, [currentPath, routeTitle])

  function goTo(path) {
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-[#171717] text-[#e5e5e5]">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#262626] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#3b82f6]"
        href="#app-content"
      >
        Pular para conteudo
      </a>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col border-r border-[#404040] bg-[#262626] transition-transform duration-200 lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : ''
        }`}
      >
        <div className="flex h-16 items-center border-b border-[#404040] px-3">
          <BrandLogo
            iconClassName="size-8 rounded-sm"
            markClassName="size-5"
            textClassName="text-xl font-bold leading-7 tracking-[-0.025em] text-[#e5e5e5]"
          />
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pt-4" aria-label="Principal">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                active={isActive(currentPath, item)}
                item={item}
                key={`${item.label}-${item.href}`}
                onNavigate={goTo}
              />
            ))}
          </div>
        </nav>

        <div className="p-3">
          <button
            className="w-full rounded-md border border-[#404040] bg-[#303030] px-3 py-2.5 text-left transition hover:border-[#525252] hover:bg-[#333333]"
            onClick={() => goTo('/perfil')}
            type="button"
          >
            <p className="truncate text-xs font-semibold text-[#e5e5e5]">Dr. Henrique Cardoso</p>
            <p className="mt-0.5 truncate text-[11px] leading-4 text-[#a3a3a3]">Médico Clínico Geral</p>
          </button>
        </div>
      </aside>

      {menuOpen ? (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
          type="button"
        />
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 h-auto border-b border-[#404040] bg-[#262626] px-4 py-3 md:px-8 lg:h-16 lg:py-0">
          <div className="flex h-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <button
                aria-label="Abrir menu"
                className="rounded-md border border-[#404040] bg-[#303030] px-3 py-2 text-sm font-semibold text-[#e5e5e5] lg:hidden"
                onClick={() => setMenuOpen(true)}
                type="button"
              >
                Menu
              </button>
              <div className="relative w-full max-w-sm lg:w-96">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a3a3a3]" />
                <input
                  aria-label="Busca rapida"
                  className="h-[38px] w-full rounded-sm border border-[#404040] bg-[#303030] py-2 pl-10 pr-4 text-sm text-[#e5e5e5] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                  onChange={(event) => setQuickSearch(event.target.value)}
                  placeholder="Buscar paciente, prontuário..."
                  value={quickSearch}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                aria-label="Notificacoes"
                className="relative grid size-8 place-items-center text-[#a3a3a3] transition hover:text-[#e5e5e5]"
                type="button"
              >
                <BellIcon className="size-5" />
                <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-[#ef4444] text-[10px] font-bold leading-none text-white">
                  3
                </span>
              </button>

              <span className="hidden h-6 w-px bg-[#404040] sm:block" aria-hidden="true" />

              <button
                className="flex min-w-0 items-center gap-3 text-left"
                onClick={() => goTo('/perfil')}
                type="button"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/15 text-xs font-bold text-[#3b82f6]">
                  HC
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block truncate text-sm font-semibold leading-4 text-[#e5e5e5]">
                    Dr. Henrique Cardoso
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] font-medium leading-4 text-[#51a2ff]">
                    Médico(a)
                  </span>
                </span>
                <ChevronDownIcon className="hidden size-4 text-[#a3a3a3] sm:block" />
              </button>
            </div>
          </div>
          {quickSearch ? (
            <div className="mt-3 rounded-md border border-[#404040] bg-[#303030] px-4 py-3 text-sm text-[#a3a3a3] lg:absolute lg:left-8 lg:top-[52px] lg:w-96">
              Busca local ativa por <strong className="text-[#e5e5e5]">{quickSearch}</strong>.
            </div>
          ) : null}
        </header>

        <main className="w-full px-4 py-6 md:px-8 md:py-8" id="app-content">
          <div className="sr-only" aria-live="polite">
            {pageTitle}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({ active, item, onNavigate }) {
  return (
    <a
      aria-current={active ? 'page' : undefined}
      className={`flex h-9 items-center gap-3 rounded-sm px-2 text-sm font-medium transition ${
        active ? 'bg-[#3b82f6]/10 text-[#3b82f6]' : 'text-[#a3a3a3] hover:bg-[#303030] hover:text-[#e5e5e5]'
      }`}
      href={item.href}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(item.href)
      }}
    >
      <AppIcon className="size-5 shrink-0" name={item.icon} />
      <span>{item.label}</span>
    </a>
  )
}

function isActive(pathname, item) {
  if (item.activePaths?.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return true
  }

  if (item.activePrefixes?.some((path) => pathname.startsWith(path))) {
    return true
  }

  if (item.exact) {
    return pathname === item.href
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function AppIcon({ className = 'size-5', name }) {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  }

  if (name === 'calendar') {
    return (
      <svg {...common}>
        <path d="M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
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

  if (name === 'file') {
    return (
      <svg {...common}>
        <path d="M7 3h7l4 4v14H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
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

  if (name === 'message') {
    return (
      <svg {...common}>
        <path d="M5 5h14v10H8l-4 4V6a1 1 0 0 1 1-1Z" />
      </svg>
    )
  }

  if (name === 'chart') {
    return (
      <svg {...common}>
        <path d="M4 17 9 11l4 4 7-9" />
        <path d="M4 20h16" />
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

  if (name === 'settings') {
    return (
      <svg {...common}>
        <path d="M12 3v3M12 18v3M4.9 4.9 7 7M17 17l2.1 2.1M3 12h3M18 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  )
}

function BellIcon({ className = 'size-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}

function ChevronDownIcon({ className = 'size-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function SearchIcon({ className = 'size-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m21 21-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  )
}
