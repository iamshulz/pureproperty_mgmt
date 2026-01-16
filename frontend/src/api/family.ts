import axios from 'axios'

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? ''

export interface FamilyPayload {
  propertyId: string;
  lastName: string;
}

export interface FamilyResponse {
  id: string;
  propertyId: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export const createFamily = async (payload: FamilyPayload): Promise<any> => {
  const res = await axios.post(`${API_BASE}/families`, payload)
  return res.data
}

export const getAllFamily = async (): Promise<any> => {
  const res = await axios.get(`${API_BASE}/families`)
  return res.data
}

export const deleteFamily = async (id: string): Promise<any> => {
  const res = await axios.delete(`${API_BASE}/families/${id}`)
  return res.data
}

export const updateFamily = async (id: string, payload: FamilyPayload): Promise<FamilyResponse> => {
  const res = await axios.put(`${API_BASE}/families/${id}`, payload)
  return res.data
}

export default { createFamily, getAllFamily, deleteFamily, updateFamily }
