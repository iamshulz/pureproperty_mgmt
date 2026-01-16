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


export default { createProperties }
