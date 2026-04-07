import { useState } from 'react'

import { BrandLogo } from '../components/Brand.jsx'
import loginClinicImage from '../assets/figma/login-clinic.png'

export function LoginPage({ navigate }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    navigate('/inicio')
  }

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden min-h-screen overflow-hidden lg:block">
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            src={loginClinicImage}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(126.72deg, rgba(10, 22, 40, 0.9) 0%, rgba(10, 22, 40, 0.6) 50%, rgba(59, 130, 246, 0.3) 100%)',
            }}
          />

          <div className="relative flex min-h-screen flex-col justify-between px-[43px] py-[43px] xl:px-12 xl:py-12">
            <LoginLogo />

            <div className="max-w-[488px] pb-0">
              <h1 className="text-[32px] font-bold leading-[40px] tracking-[-0.02em] xl:text-4xl xl:leading-[45px]">
                Gestão clínica
                <br />
                <span className="text-[#3b82f6]">inteligente</span> com IA
                <br />
                preditiva.
              </h1>
              <p className="mt-5 max-w-[352px] text-sm leading-[23px] text-white/60 xl:text-base xl:leading-[26px]">
                Reduza o absenteísmo, organize sua agenda e melhore a experiência dos seus pacientes.
              </p>

              <dl className="mt-[38px] flex flex-wrap gap-8">
                <LoginMetric label="Acurácia IA" value="87%" />
                <LoginMetric label="Absenteísmo" value="↓42%" />
                <LoginMetric label="Clínicas" value="+2.8k" />
              </dl>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-[60px] xl:px-[68px]">
          <div className="w-full max-w-[448px] lg:translate-y-3">
            <div className="mb-12 lg:hidden">
              <LoginLogo />
            </div>

            <div>
              <h2 className="text-[30px] font-bold leading-9 text-white">Entrar</h2>
              <p className="mt-1 text-sm leading-5 text-white/40">
                Bem-vindo(a) de volta! Acesse sua conta.
              </p>
            </div>

            <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
              <LoginField htmlFor="login-email" label="E-mail">
                <input
                  autoComplete="email"
                  className="h-11 w-full rounded-[6px] border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                  id="login-email"
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="seu@email.com"
                  type="email"
                  value={form.email}
                />
              </LoginField>

              <LoginField
                action={
                  <button
                    className="text-xs font-medium leading-4 text-[#3b82f6] transition hover:text-[#66a3ff]"
                    onClick={() => navigate('/recuperar-senha')}
                    type="button"
                  >
                    Esqueceu a senha?
                  </button>
                }
                htmlFor="login-password"
                label="Senha"
              >
                <div className="relative">
                  <input
                    autoComplete="current-password"
                    className="h-11 w-full rounded-[6px] border border-white/10 bg-white/[0.05] py-2 pl-4 pr-11 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                    id="login-password"
                    onChange={(event) => updateField('password', event.target.value)}
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                  />
                  <button
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute right-3 top-1/2 grid size-5 -translate-y-1/2 place-items-center text-white/30 transition hover:text-white/60"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    <EyeIcon />
                  </button>
                </div>
              </LoginField>

              <button
                className="inline-flex h-11 w-full items-center justify-center rounded-[6px] border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_15px_rgba(59,130,246,0.2),0_4px_6px_rgba(59,130,246,0.2)] transition hover:bg-[#3478ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b82f6]"
                type="submit"
              >
                Entrar
              </button>
            </form>
          </div>

          <button
            className="absolute bottom-4 right-4 flex h-[29px] items-center gap-1.5 rounded-sm border border-white/10 bg-white/[0.05] px-3 font-mono text-[10px] font-medium leading-[15px] text-white/30 transition hover:text-white/50"
            onClick={() => {
              setForm({
                email: 'recepcao@mediconnect.com',
                password: 'demo123',
              })
            }}
            title="Preencher credenciais mockadas"
            type="button"
          >
            dev · credenciais
            <span aria-hidden="true" className="text-[9px]">
              ^
            </span>
          </button>
        </section>
      </div>
    </main>
  )
}

export function RegisterPage({ navigate }) {
  const [role, setRole] = useState('Clinica')

  return (
    <AuthLayout
      description="Crie um acesso mockado para navegar pelo ambiente da clínica."
      title="Criar acesso"
    >
      <form
        className="mt-8 grid gap-5"
        onSubmit={(event) => {
          event.preventDefault()
          navigate('/inicio')
        }}
      >
        <AuthField label="Nome da organização">
          <input className={authInputClass} defaultValue="Clínica Boa Vista" />
        </AuthField>
        <AuthField label="Responsável">
          <input className={authInputClass} defaultValue="Marina Lopes" />
        </AuthField>
        <AuthField label="Tipo de conta">
          <div className="grid grid-cols-2 gap-2">
            {['Clinica', 'Profissional'].map((option) => (
              <button
                className={`h-11 rounded-[6px] border px-3 text-sm font-semibold transition ${
                  role === option
                    ? 'border-[#3b82f6] bg-[#3b82f6]/15 text-[#3b82f6]'
                    : 'border-white/10 bg-white/[0.05] text-white/50 hover:text-white'
                }`}
                key={option}
                onClick={() => setRole(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </AuthField>
        <button className="inline-flex h-11 w-full items-center justify-center rounded-[6px] bg-[#3b82f6] text-sm font-semibold text-white shadow-[0_10px_15px_rgba(59,130,246,0.2)] transition hover:bg-[#3478ed]" type="submit">
          Continuar
        </button>
      </form>
      <button className="mt-5 text-sm font-semibold text-[#3b82f6]" onClick={() => navigate('/login')} type="button">
        Voltar para login
      </button>
    </AuthLayout>
  )
}

export function ForgotPasswordPage({ navigate }) {
  const [sent, setSent] = useState(false)

  return (
    <AuthLayout
      description="Informe o e-mail cadastrado para receber um link mockado."
      title="Recuperar senha"
    >
      {sent ? (
        <div className="mt-8 rounded-[6px] border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-300">
          Link de recuperação mockado enviado para o e-mail informado.
        </div>
      ) : (
        <form
          className="mt-8 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault()
            setSent(true)
          }}
        >
          <AuthField label="E-mail cadastrado">
            <input autoComplete="email" className={authInputClass} defaultValue="recepcao@mediconnect.com" type="email" />
          </AuthField>
          <button className="inline-flex h-11 w-full items-center justify-center rounded-[6px] bg-[#3b82f6] text-sm font-semibold text-white shadow-[0_10px_15px_rgba(59,130,246,0.2)] transition hover:bg-[#3478ed]" type="submit">
            Enviar link
          </button>
        </form>
      )}
      <button className="mt-5 text-sm font-semibold text-[#3b82f6]" onClick={() => navigate('/login')} type="button">
        Voltar para login
      </button>
    </AuthLayout>
  )
}

function AuthLayout({ children, description, title }) {
  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden min-h-screen overflow-hidden lg:block">
          <img alt="" className="absolute inset-0 h-full w-full object-cover" src={loginClinicImage} />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(126.72deg, rgba(10, 22, 40, 0.9) 0%, rgba(10, 22, 40, 0.6) 50%, rgba(59, 130, 246, 0.3) 100%)',
            }}
          />
          <div className="relative flex min-h-screen flex-col justify-between px-[43px] py-[43px] xl:px-12 xl:py-12">
            <LoginLogo />
            <div className="max-w-[488px]">
              <h1 className="text-[32px] font-bold leading-[40px] tracking-[-0.02em] xl:text-4xl xl:leading-[45px]">
                Cuidado conectado
                <br />
                para equipes de
                <br />
                <span className="text-[#3b82f6]">saúde.</span>
              </h1>
              <p className="mt-5 max-w-[360px] text-sm leading-[23px] text-white/60 xl:text-base xl:leading-[26px]">
                Fluxos de acesso simulados para manter a navegação ponta a ponta sem backend real.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-[60px] xl:px-[68px]">
          <div className="w-full max-w-[448px]">
            <div className="mb-12 lg:hidden">
              <LoginLogo />
            </div>
            <h2 className="text-[30px] font-bold leading-9 text-white">{title}</h2>
            <p className="mt-1 text-sm leading-5 text-white/40">{description}</p>
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

const authInputClass =
  'h-11 w-full rounded-[6px] border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20'

function AuthField({ children, label }) {
  return (
    <label className="grid gap-1.5 text-xs font-medium leading-4 text-white/50">
      <span>{label}</span>
      {children}
    </label>
  )
}

function LoginField({ action, children, htmlFor, label }) {
  return (
    <div className="grid gap-1.5">
      <span className="flex min-h-4 items-center justify-between gap-4 text-xs font-medium leading-4 text-white/50">
        <label htmlFor={htmlFor}>{label}</label>
        {action}
      </span>
      {children}
    </div>
  )
}

function LoginLogo() {
  return (
    <BrandLogo />
  )
}

function LoginMetric({ label, value }) {
  return (
    <div>
      <dt className="text-[21px] font-bold leading-7 text-[#3b82f6] xl:text-2xl xl:leading-8">{value}</dt>
      <dd className="mt-0.5 text-[11px] leading-4 text-white/50 xl:text-xs">{label}</dd>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M1.375 8.23c-.06-.16-.06-.34 0-.5a7.16 7.16 0 0 1 13.25 0c.06.16.06.34 0 .5a7.16 7.16 0 0 1-13.25 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.33"
      />
      <path
        d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.33"
      />
    </svg>
  )
}
