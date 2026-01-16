import axios from 'axios'

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? ''

interface ReminderPayload {
  email: string;
  propertyId: string;
  propertyName: string;
  title: string;
  eventDate: string;
}

export const createReminder = async (payload: ReminderPayload): Promise<any> => {
  const res = await axios.post(`${API_BASE}/properties`, payload)
  return res.data
}

export default { createReminder }
