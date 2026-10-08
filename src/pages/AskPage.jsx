import { useEffect, useRef } from 'react'
import ChatInput from '../components/chat/ChatInput'
import EmptyState from '../components/chat/EmptyState'
import MessageBubble from '../components/chat/MessageBubble'
import { useChat } from '../hooks/useChat'

export default function AskPage({ memoryId, onGoToPlaces }) {
  const { messages, busy, send, reset } = useChat(memoryId)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-3">
        {messages.length === 0 && <EmptyState onPick={send} onSavePlaces={onGoToPlaces} />}
        {messages.map((m, i) => (
          <MessageBubble key={i} {...m} />
        ))}
        {busy && <div className="w-fit rounded-2xl bg-tar px-4 py-3 text-sm text-chalk/70">Checking the routes…</div>}
        <div ref={endRef} />
        </div>
      </div>
      <ChatInput onSend={send} onNewTrip={reset} busy={busy} showNewTrip={messages.length > 0} />
    </>
  )
}
