import { useState } from 'react'
import { addRoute } from '../api/oyago'
import PrivacyLink from '../components/layout/PrivacyLink'
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
    <form onSubmit={submit} className="overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-2xl space-y-3">
      <p className="font-display text-xl font-bold md:text-2xl">Share a route you know</p>
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
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
        <TextField placeholder="Fare, e.g. ₦600 – ₦900" {...bind('fare')} />
        <TextField placeholder="Tips (rush hour, safety…)" {...bind('tips')} />
      </div>
      <TextField placeholder="Your name (optional)" {...bind('contributor')} />
      <Button disabled={busy} className="w-full sm:w-auto sm:px-8">
        {busy ? 'Sending…' : 'Add route'}
      </Button>
      <p className="text-xs text-chalk/50">
        Routes you share are shown to other users, with your name if you add one. See our{' '}
        <PrivacyLink>privacy policy</PrivacyLink>.
      </p>
      {message && <p className="text-sm text-chalk/80">{message}</p>}
      </div>
    </form>
  )
}
