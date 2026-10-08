export default function Chip({ active, ...props }) {
  return (
    <button
      type="button"
      className={`rounded-full px-3 py-1 text-sm ${active ? 'bg-danfo text-ink' : 'bg-road'}`}
      {...props}
    />
  )
}
