import { useEffect, useState } from 'react'
import Header from './components/layout/Header'
import TabNav from './components/layout/TabNav'
import { PRIVACY_PATH } from './constants'
import { useMemoryId } from './hooks/useMemoryId'
import AddRoutePage from './pages/AddRoutePage'
import AskPage from './pages/AskPage'
import PlacesPage from './pages/PlacesPage'
import PrivacyPage from './pages/PrivacyPage'

const onPrivacyPage = () => location.pathname === PRIVACY_PATH

export default function App() {
  const [tab, setTab] = useState('ask')
  const [showPrivacy, setShowPrivacy] = useState(onPrivacyPage)
  const { memoryId, error } = useMemoryId()

  useEffect(() => {
    const sync = () => setShowPrivacy(onPrivacyPage())
    addEventListener('popstate', sync)
    return () => removeEventListener('popstate', sync)
  }, [])

  function goTo(id) {
    if (showPrivacy) history.pushState(null, '', '/')
    setShowPrivacy(false)
    setTab(id)
  }

  return (
    <div className="flex h-full flex-col">
      <Header />

      {/* phone: one column with tabs on top. desktop: tabs become a sidebar next to the content */}
      <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col md:max-w-6xl md:flex-row md:gap-6 md:p-6">
        <TabNav active={showPrivacy ? null : tab} onChange={goTo} />

        <div className="flex min-h-0 flex-1 flex-col md:overflow-hidden md:rounded-2xl md:border md:border-road">
          {error && <p className="m-4 rounded-lg bg-red-900/40 p-3 text-sm">Can't reach the server: {error}</p>}

          <main className="flex min-h-0 flex-1 flex-col">
            {showPrivacy ? (
              <PrivacyPage onBack={() => goTo(tab)} />
            ) : (
              <>
                {tab === 'ask' && <AskPage memoryId={memoryId} onGoToPlaces={() => goTo('places')} />}
                {tab === 'places' && <PlacesPage memoryId={memoryId} />}
                {tab === 'add' && <AddRoutePage />}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
