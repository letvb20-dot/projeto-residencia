export function BrandLogo({
  className = '',
  iconClassName = 'size-10 rounded-[6px]',
  markClassName = 'size-6',
  textClassName = 'text-2xl font-bold leading-8 tracking-[-0.025em] text-white',
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`grid place-items-center bg-[#3b82f6] text-white ${iconClassName}`}>
        <StethoscopeIcon className={markClassName} />
      </div>
      <p className={textClassName}>MediConnect</p>
    </div>
  )
}

export function StethoscopeIcon({ className = 'size-6' }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M6 4H5a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V6a2 2 0 0 0-2-2h-1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M3 9a6 6 0 0 0 12 0V4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path d="M9 4v2" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M18 11a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" stroke="currentColor" strokeWidth="2" />
      <path
        d="M15 10c0 3.3 1.35 4 3 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
