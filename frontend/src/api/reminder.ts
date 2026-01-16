import axios from 'axios'
import type { Ref, UnwrapRef } from 'vue'

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? ''

export interface ReminderPayload {
  email: string;
  propertyId: string;
  propertyName: string;
  title: string;
  eventDate: string;
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
  console.log(res.data)
  return res.data
}

export default { createReminder, getRemindersByAgent }
