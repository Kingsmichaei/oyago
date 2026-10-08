import { useEffect, useState } from 'react'
import { createSession } from '../api/oyago'
import { MEMORY_ID_KEY } from '../constants'

function readStored() {
  try {
    return localStorage.getItem(MEMORY_ID_KEY)
  } catch {
    return null
  }
}

/** The phone keeps its own Backboard memory id, so the server stays stateless. */
export function useMemoryId() {
  const [memoryId, setMemoryId] = useState(readStored)
  const [error, setError] = useState('')

  useEffect(() => {
    if (memoryId) return
    createSession()
      .then(({ memory_id }) => {
        try {
          localStorage.setItem(MEMORY_ID_KEY, memory_id)
        } catch {}
        setMemoryId(memory_id)
      })
      .catch((e) => setError(e.message))
  }, [memoryId])

  return { memoryId, error }
}
