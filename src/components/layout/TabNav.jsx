import { TABS } from '../../constants'
import PrivacyLink from './PrivacyLink'

export default function TabNav({ active, onChange }) {
  return (
    <nav className="flex gap-1 bg-tar p-1.5 md:w-56 md:shrink-0 md:flex-col md:self-start md:rounded-2xl md:p-2">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition md:flex-none md:px-4 md:py-3 md:text-left ${
            active === tab.id ? 'bg-danfo text-ink' : 'text-chalk/70 hover:text-chalk'
          }`}
        >
          {tab.label}
        </button>
      ))}
      <PrivacyLink className="mt-2 hidden px-4 py-2 text-xs text-chalk/50 hover:text-chalk md:block" />
    </nav>
  )
}
