import { useRef, useState } from 'react'
import { locate } from '../api/oyago'

const MESSAGES = {
  unsupported: 'This browser no fit share location. Type where you dey instead.',
  insecure: 'Location only work on https. Type where you dey instead.',
  denied: 'You no allow location. Type where you dey instead, or allow am for browser settings.',
  unavailable: 'Location no work. Type where you dey instead.',
  timeout: 'Location dey slow. Try again or type where you dey.',
  notFound: "I no fit tell which bus stop you dey near. Type where you dey instead.",
  server: "Can't reach the server. Type where you dey instead.",
}

// GeolocationPositionError codes
const GEO_ERRORS = { 1: 'denied', 2: 'unavailable', 3: 'timeout' }

function getPosition() {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }),
  )
}

/**
 * Finds the bus stop the user is near, only when they ask (`detect`). The exact coordinates go to
 * our /locate endpoint and are then dropped: only the place name is kept and sent with questions.
 */
export function useCurrentLocation() {
  const [origin, setOriginName] = useState('')
  const [status, setStatus] = useState('idle') // idle | locating | ready | error
  const [error, setError] = useState('')
  const attempt = useRef(0) // ignore a slow lookup the user has already cleared or replaced

  function fail(kind) {
    setStatus('error')
    setError(MESSAGES[kind])
  }

  async function detect() {
    if (!('geolocation' in navigator)) return fail('unsupported')
    if (!window.isSecureContext) return fail('insecure')

    const id = ++attempt.current
    setStatus('locating')
    setError('')

    let position
    try {
      position = await getPosition()
    } catch (e) {
      if (id === attempt.current) fail(GEO_ERRORS[e.code] || 'unavailable')
      return
    }

    try {
      const { latitude: lat, longitude: lng } = position.coords
      const res = await locate({ lat, lng })
      if (id !== attempt.current) return
      if (!res.name) return fail('notFound')
      setOriginName(res.name)
      setStatus('ready')
    } catch {
      if (id === attempt.current) fail('server')
    }
  }

  function setOrigin(name) {
    const value = name.trim()
    if (!value) return clear()
    attempt.current++
    setOriginName(value)
    setStatus('ready')
    setError('')
  }

  function clear() {
    attempt.current++
    setOriginName('')
    setStatus('idle')
    setError('')
  }

  return { origin, status, error, detect, setOrigin, clear }
}
