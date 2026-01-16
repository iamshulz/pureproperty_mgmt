import axios from 'axios'

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? ''

export interface PropertyPayload {
  agentId: string
  title: string
}

export const createProperties = async (payload: PropertyPayload): Promise<any> => {
  const res = await axios.post(`${API_BASE}/properties`, payload)
  return res.data
}

export const getProperties = async () => {
  const res = await axios.get(`${API_BASE}/properties`)
  return res.data
}

export const deleteProperty = async (id: string) => {
  const res = await axios.delete(`${API_BASE}/properties/${id}`)
  return res.data
}

export default { createProperties }
