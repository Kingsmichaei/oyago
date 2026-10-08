import Markdown from 'react-markdown'

export default function MessageBubble({ role, text, error }) {
  if (role === 'user') {
    return (
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-danfo px-4 py-2.5 text-ink">{text}</div>
    )
  }
  return (
    <div
      className={`answer max-w-[92%] rounded-2xl rounded-bl-sm px-4 py-3 text-[15px] leading-relaxed ${
        error ? 'bg-red-900/40' : 'bg-tar'
      }`}
    >
      <Markdown>{text}</Markdown>
    </div>
  )
}
