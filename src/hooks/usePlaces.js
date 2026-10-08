import { useCallback, useEffect, useState } from 'react'
import * as api from '../api/oyago'

export function usePlaces(memoryId) {
  const [places, setPlaces] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!memoryId) return
    try {
      const res = await api.listPlaces(memoryId)
      setPlaces(res.places)
    } catch (e) {
      setError(e.message)
    }
  }, [memoryId])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function add(label, place) {
    setSaving(true)
    setError('')
    try {
      await api.addPlace({ memoryId, label, place })
      await refresh()
      return true
    } catch (e) {
      setError(e.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  async function remove(placeId) {
    try {
      await api.deletePlace({ memoryId, placeId })
    } catch (e) {
      setError(e.message)
    }
    refresh()
  }

  return { places, saving, error, add, remove }
}
