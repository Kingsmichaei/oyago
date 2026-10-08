import { TABS } from '../../constants'

export default function TabNav({ active, onChange }) {
  return (
    <nav className="flex gap-1 bg-tar p-1.5">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            active === tab.id ? 'bg-danfo text-ink' : 'text-chalk/70 hover:text-chalk'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
