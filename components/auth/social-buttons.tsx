export function SocialButtons() {
  const providers = [
    {
      name: 'Google',
      icon: (
        <svg viewBox="0 0 24 24" className="size-5">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
      ),
    },
    {
      name: 'Apple',
      icon: (
        <svg viewBox="0 0 24 24" className="size-5 fill-foreground">
          <path d="M16.36 12.9c-.02-2.03 1.66-3 1.73-3.05-.94-1.38-2.4-1.57-2.92-1.59-1.24-.13-2.42.73-3.05.73-.63 0-1.6-.71-2.63-.69-1.35.02-2.6.79-3.29 2-1.4 2.44-.36 6.05 1 8.03.67.97 1.46 2.06 2.5 2.02 1-.04 1.38-.65 2.6-.65 1.2 0 1.55.65 2.6.63 1.08-.02 1.76-.99 2.42-1.96.76-1.12 1.08-2.21 1.09-2.27-.02-.01-2.09-.8-2.11-3.18zM14.4 6.9c.55-.67.93-1.6.82-2.53-.8.03-1.77.53-2.34 1.2-.51.59-.96 1.53-.84 2.44.89.07 1.8-.45 2.36-1.11z" />
        </svg>
      ),
    },
  ]
  return (
    <div className="grid grid-cols-2 gap-3">
      {providers.map((p) => (
        <button
          key={p.name}
          type="button"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
        >
          {p.icon}
          {p.name}
        </button>
      ))}
    </div>
  )
}
