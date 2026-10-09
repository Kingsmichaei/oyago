import { useState } from 'react'

const LINK = 'text-danfo underline underline-offset-2 hover:text-danfo-deep'

function OriginEditor({ initial, onSave, onClear, onCancel }) {
  const [value, setValue] = useState(initial)

  function save(e) {
    e.preventDefault()
    onSave(value)
  }

  return (
    // not a <form>: this sits inside the chat input's form
    <div className="flex items-center gap-2 text-sm">
      <span className="shrink-0 text-chalk/70">Starting from:</span>
      <input
        autoFocus
        value={value}
        maxLength={80}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save(e)
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="e.g. Ikotun"
        aria-label="Where you dey start from"
        className="min-w-0 flex-1 rounded-lg bg-tar px-3 py-1.5 outline-none placeholder:text-chalk/40 focus:ring-2 focus:ring-danfo"
      />
      <button type="button" onClick={save} className="rounded-lg bg-danfo px-3 py-1.5 font-bold text-ink">
        Save
      </button>
      <button type="button" onClick={onClear} aria-label="Clear starting point" className="px-1 text-chalk/60 hover:text-chalk">
        ✕
      </button>
    </div>
  )
}

export default function OriginBar({ origin, status, error, onDetect, onChange, onClear }) {
  const [editing, setEditing] = useState(false)

  if (status === 'ready' && editing) {
    return (
      <OriginEditor
        initial={origin}
        onSave={(name) => {
          onChange(name)
          setEditing(false)
        }}
        onClear={() => {
          onClear()
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  if (status === 'ready') {
    return (
      <p className="text-sm text-chalk/70">
        Starting from: <strong className="font-semibold text-danfo">{origin}</strong> ·{' '}
        <button type="button" onClick={() => setEditing(true)} className={LINK}>
          Change
        </button>
      </p>
    )
  }

  const locating = status === 'locating'
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <button
        type="button"
        onClick={onDetect}
        disabled={locating}
        className="rounded-full bg-road px-3 py-1 font-semibold transition hover:bg-danfo hover:text-ink disabled:opacity-60 disabled:hover:bg-road disabled:hover:text-chalk"
      >
        {locating ? '📍 Finding where you dey…' : '📍 Use my location'}
      </button>
      {error && (
        <span role="status" className="text-xs text-chalk/60">
          {error}
        </span>
      )}
    </div>
  )
}
