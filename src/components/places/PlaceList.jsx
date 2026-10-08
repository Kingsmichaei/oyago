export default function PlaceList({ places, onRemove }) {
  return (
    <ul className="mt-4 space-y-2">
      {places.map((p) => (
        <li
          key={p.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-road px-4 py-3 text-sm"
        >
          <span>{p.text}</span>
          <button onClick={() => onRemove(p.id)} className="text-chalk/50 hover:text-red-400" aria-label="Remove">
            ✕
          </button>
        </li>
      ))}
    </ul>
  )
}
