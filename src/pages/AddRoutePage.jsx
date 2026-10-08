import { useState } from 'react'
import { addRoute } from '../api/oyago'
import Button from '../components/ui/Button'
import { TextArea, TextField } from '../components/ui/TextField'
import { EMPTY_ROUTE } from '../constants'

export default function AddRoutePage() {
  const [form, setForm] = useState(EMPTY_ROUTE)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const bind = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) })

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      await addRoute(form)
      setForm(EMPTY_ROUTE)
      setMessage('Thank you! Your route is being added. Others can ask about it in a minute.')
    } catch (err) {
      setMessage(`Wahala: ${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 overflow-y-auto p-4">
      <p className="font-display text-xl font-bold">Share a route you know</p>
      <p className="text-sm text-chalk/70">Only routes you have taken yourself. This is how OyaGo learns Lagos.</p>
      <div className="flex gap-2">
        <TextField required placeholder="From" {...bind('origin')} />
        <TextField required placeholder="To" {...bind('destination')} />
      </div>
      <TextArea
        required
        rows={5}
        placeholder={'Steps, one per line:\n1. Board at… (conductor shouts "…")\n2. Drop at… (landmark)\n3. …'}
        {...bind('steps')}
      />
      <TextField placeholder="Fare, e.g. ₦600 – ₦900" {...bind('fare')} />
      <TextField placeholder="Tips (rush hour, safety…)" {...bind('tips')} />
      <TextField placeholder="Your name (optional)" {...bind('contributor')} />
      <Button disabled={busy} className="w-full">
        {busy ? 'Sending…' : 'Add route'}
      </Button>
      {message && <p className="text-sm text-chalk/80">{message}</p>}
    </form>
  )
}
