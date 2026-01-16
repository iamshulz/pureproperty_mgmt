import axios from 'axios'

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? ''

export const createTenant = async (payload): Promise<any> => {
  const res = await axios.post(`${API_BASE}/tenants`, payload)
  return res.data
}

export default { createTenant, getTenants }
