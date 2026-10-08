import PrivacyLink from '../components/layout/PrivacyLink'
import PlaceForm from '../components/places/PlaceForm'
import PlaceList from '../components/places/PlaceList'
import { usePlaces } from '../hooks/usePlaces'

export default function PlacesPage({ memoryId }) {
  const { places, saving, error, add, remove } = usePlaces(memoryId)

  return (
    <div className="overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
      <p className="font-display text-xl font-bold md:text-2xl">Your places</p>
      <p className="mt-1 text-sm text-chalk/70">
        Save them once. Then ask "take me go work" and OyaGo knows where you mean. A landmark or area is
        enough, no need for your exact address. <PrivacyLink className="text-chalk/50">How we store them</PrivacyLink>
      </p>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
        <PlaceForm onSave={add} saving={saving} disabled={!memoryId} />
        <div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <PlaceList places={places} onRemove={remove} />
        </div>
      </div>
      </div>
    </div>
  )
}
