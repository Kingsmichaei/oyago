export default function Header() {
  return (
    <>
      <header className="bg-danfo px-4 pb-3 pt-[max(env(safe-area-inset-top),14px)] text-ink">
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">OyaGo</h1>
          <span className="text-xs font-semibold uppercase tracking-widest">Lagos, by bus</span>
        </div>
      </header>
      <div className="danfo-stripe h-2" />
    </>
  )
}
