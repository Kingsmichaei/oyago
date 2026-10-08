import { request } from './client'

const q = encodeURIComponent

export const createSession = () => request('/session', { method: 'POST' })

export const askQuestion = ({ question, memoryId, threadId }) =>
  request('/ask', {
    method: 'POST',
    body: { question, memory_id: memoryId, thread_id: threadId },
  })

export const listPlaces = (memoryId) => request(`/places?memory_id=${q(memoryId)}`)

export const addPlace = ({ memoryId, label, place }) =>
  request('/places', { method: 'POST', body: { memory_id: memoryId, label, place } })

export const deletePlace = ({ memoryId, placeId }) =>
  request(`/places/${q(placeId)}?memory_id=${q(memoryId)}`, { method: 'DELETE' })

export const addRoute = (route) => request('/routes', { method: 'POST', body: route })
