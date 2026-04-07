const toneClasses = {
  blue: 'bg-sky-50 text-sky-700 border-sky-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-rose-50 text-rose-700 border-rose-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  neutral: 'bg-white text-slate-700 border-slate-200',
}

const buttonVariants = {
  primary:
    'border-sky-700 bg-sky-700 text-white hover:bg-sky-800 focus-visible:outline-sky-700',
  secondary:
    'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-500',
  ghost:
    'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-500',
  danger:
    'border-rose-600 bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600',
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${buttonVariants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </section>
  )
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${toneClasses[tone] || toneClasses.neutral} ${className}`}
    >
      {children}
    </span>
  )
}

export function PageHeader({ actions, description, eyebrow, title }) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3b82f6]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#e5e5e5] md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#a3a3a3] md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  )
}

export function StatCard({ helper, label, tone = 'slate', value }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <span className={`h-3 w-3 rounded-sm ${dotTone(tone)}`} aria-hidden="true" />
      </div>
      <p className="mt-3 text-sm text-slate-600">{helper}</p>
    </Card>
  )
}

export function EmptyState({ action, description, title }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

export function Field({ children, hint, label }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-slate-500">{hint}</span> : null}
    </label>
  )
}

export function TextInput({ className = '', ...props }) {
  return (
    <input
      className={`min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 ${className}`}
      {...props}
    />
  )
}

export function SelectInput({ children, className = '', ...props }) {
  return (
    <select
      className={`min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`min-h-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 ${className}`}
      {...props}
    />
  )
}

export function Tabs({ active, items, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-1">
      {items.map((item) => (
        <button
          className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
            active === item.value
              ? 'bg-sky-700 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
          }`}
          key={item.value}
          onClick={() => onChange(item.value)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export function Modal({ actions, children, onClose, open, title }) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center">
      <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <button
            aria-label="Fechar"
            className="rounded-md px-2 py-1 text-xl leading-none text-slate-500 hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {actions ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 px-5 py-4">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function dotTone(tone) {
  const dots = {
    blue: 'bg-sky-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-rose-500',
    slate: 'bg-slate-500',
  }

  return dots[tone] || dots.slate
}
