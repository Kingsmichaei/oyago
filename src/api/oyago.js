import { request } from './client'

const q = encodeURIComponent

export const createSession = () => request('/session', { method: 'POST' })

export const askQuestion = ({ question, memoryId, threadId, origin }) =>
  request('/ask', {
    method: 'POST',
    body: { question, memory_id: memoryId, thread_id: threadId, origin: origin || undefined },
  })

export const listPlaces = (memoryId) => request(`/places?memory_id=${q(memoryId)}`)

export const addPlace = ({ memoryId, label, place }) =>
  request('/places', { method: 'POST', body: { memory_id: memoryId, label, place } })

export const deletePlace = ({ memoryId, placeId }) =>
  request(`/places/${q(placeId)}?memory_id=${q(memoryId)}`, { method: 'DELETE' })

export const addRoute = (route) => request('/routes', { method: 'POST', body: route })

// Coordinates go to our server only, to find the nearest bus stop. They are never sent with questions.
export const locate = ({ lat, lng }) => request('/locate', { method: 'POST', body: { lat, lng } })
