import axios from 'axios'

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? ''

export interface ReminderPayload {
  email: string;
  propertyId: string;
  propertyName: string;
  title: string;
  eventDate: string;
}

export interface UpdateReminderPayload {
  agentId: string
  propertyId: string
  title: string
  eventDate: string
  isCompleted: boolean
}

interface GetReminderPayload {
  email: string;
}

export const createReminder = async (payload: ReminderPayload): Promise<any> => {
  const res = await axios.post(`${API_BASE}/reminders`, payload)
  return res.data
}

export const getRemindersByAgent = async (payload: { email: string }): Promise<any> => {
  const res = await axios.post(`${API_BASE}/reminders/agent`, payload)
  return res.data
}

export const updateReminder = async (id: string, payload: UpdateReminderPayload): Promise<any> => {
  const res = await axios.put(`${API_BASE}/reminders/${id}`, payload)
  return res.data
}

export default { createReminder, getRemindersByAgent, updateReminder }
