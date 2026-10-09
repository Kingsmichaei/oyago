import { useState } from 'react'
import { askQuestion } from '../api/oyago'

export function useChat(memoryId, origin) {
  const [messages, setMessages] = useState([])
  const [threadId, setThreadId] = useState(null)
  const [busy, setBusy] = useState(false)

  async function send(text) {
    const question = text.trim()
    if (!question || busy) return
    setMessages((m) => [...m, { role: 'user', text: question }])
    setBusy(true)
    try {
      const res = await askQuestion({ question, memoryId, threadId, origin })
      setThreadId(res.thread_id)
      setMessages((m) => [...m, { role: 'ai', text: res.answer }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'ai', text: `Wahala: ${e.message}`, error: true }])
    } finally {
      setBusy(false)
    }
  }

  function reset() {
    setMessages([])
    setThreadId(null)
  }

  return { messages, busy, send, reset }
}
