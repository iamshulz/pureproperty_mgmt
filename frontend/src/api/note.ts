import axios from 'axios'
import type { UnwrapRef } from 'vue'

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? ''



export const createNote = async (payload: any): Promise<any> => {
  const res = await axios.post(`${API_BASE}/notes`, payload)
  return res.data
}

export const getNoteByEmail = async (payload: { email: string }): Promise<any> => {
  const res = await axios.post(`${API_BASE}/notes/email`, payload)
  return res.data
}

export const deleteNote = async (id: string): Promise<any> => {
  const res = await axios.delete(`${API_BASE}/notes/${id}`)
  return res.data
}

export const updateNote = async (id: string, payload: any): Promise<any> => {
  const res = await axios.put(`${API_BASE}/notes/${id}`, payload)
  return res.data
}

export default { createNote, getNoteByEmail, deleteNote, updateNote }
