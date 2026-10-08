import { useState } from 'react'
import Button from '../ui/Button'

export default function ChatInput({ onSend, onNewTrip, busy, showNewTrip }) {
  const [value, setValue] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onSend(value)
    setValue('')
  }

  return (
    <form
      onSubmit={submit}
      className="border-t border-road bg-ink p-3 pb-[max(env(safe-area-inset-bottom),12px)] md:px-6 md:py-4"
    >
      <div className="mx-auto flex max-w-3xl gap-2">
      {showNewTrip && (
        <Button type="button" variant="secondary" onClick={onNewTrip} className="px-3 text-xs">
          New trip
        </Button>
      )}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="How I go reach…"
        className="min-w-0 flex-1 rounded-xl bg-tar px-4 py-3 outline-none placeholder:text-chalk/40 focus:ring-2 focus:ring-danfo"
      />
      <Button disabled={busy || !value.trim()}>Oya</Button>
      </div>
    </form>
  )
}
