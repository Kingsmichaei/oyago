import PlaceForm from '../components/places/PlaceForm'
import PlaceList from '../components/places/PlaceList'
import { usePlaces } from '../hooks/usePlaces'

export default function PlacesPage({ memoryId }) {
  const { places, saving, error, add, remove } = usePlaces(memoryId)

  return (
    <div className="overflow-y-auto p-4">
      <p className="font-display text-xl font-bold">Your places</p>
      <p className="mt-1 text-sm text-chalk/70">
        Save them once. Then ask "take me go work" and OyaGo knows where you mean.
      </p>
      <PlaceForm onSave={add} saving={saving} disabled={!memoryId} />
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      <PlaceList places={places} onRemove={remove} />
    </div>
  )
}
