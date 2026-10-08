import { useState } from 'react'
import { PLACE_LABELS } from '../../constants'
import Button from '../ui/Button'
import Chip from '../ui/Chip'

export default function PlaceForm({ onSave, saving, disabled }) {
  const [label, setLabel] = useState(PLACE_LABELS[0])
  const [place, setPlace] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!place.trim()) return
    if (await onSave(label, place)) setPlace('')
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl bg-tar p-4">
      <div className="flex flex-wrap gap-2">
        {PLACE_LABELS.map((l) => (
          <Chip key={l} active={label === l} onClick={() => setLabel(l)}>
            {l}
          </Chip>
        ))}
      </div>
      <input
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        placeholder="e.g. Ikotun, near the roundabout"
        className="w-full rounded-xl bg-ink px-4 py-3 outline-none placeholder:text-chalk/40 focus:ring-2 focus:ring-danfo"
      />
      <Button disabled={saving || disabled} className="w-full">
        {saving ? 'Saving…' : `Save as ${label}`}
      </Button>
    </form>
  )
}
