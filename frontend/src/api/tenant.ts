import axios from 'axios'

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? ''

export interface TenantPayload {
  familyId: string
  firstName: string
  middleName: string
  lastName: string
}

export interface TenantResponse extends TenantPayload {
  id: string
  createdAt: string
  updatedAt: string
}

export const createTenant = async (payload: TenantPayload): Promise<any> => {
  const res = await axios.post(`${API_BASE}/tenants`, payload)
  return res.data
}

export const getTenants = async (): Promise<TenantResponse[]> => {
  const res = await axios.get(`${API_BASE}/tenants`)
  return res.data
}

export default { createTenant, getTenants }
