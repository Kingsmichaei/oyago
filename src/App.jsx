import { useState } from 'react'
import Header from './components/layout/Header'
import TabNav from './components/layout/TabNav'
import { useMemoryId } from './hooks/useMemoryId'
import AddRoutePage from './pages/AddRoutePage'
import AskPage from './pages/AskPage'
import PlacesPage from './pages/PlacesPage'

export default function App() {
  const [tab, setTab] = useState('ask')
  const { memoryId, error } = useMemoryId()

  return (
    <div className="mx-auto flex h-full max-w-md flex-col">
      <Header />
      <TabNav active={tab} onChange={setTab} />

      {error && <p className="m-4 rounded-lg bg-red-900/40 p-3 text-sm">Can't reach the server: {error}</p>}

      <main className="flex min-h-0 flex-1 flex-col">
        {tab === 'ask' && <AskPage memoryId={memoryId} onGoToPlaces={() => setTab('places')} />}
        {tab === 'places' && <PlacesPage memoryId={memoryId} />}
        {tab === 'add' && <AddRoutePage />}
      </main>
    </div>
  )
}
