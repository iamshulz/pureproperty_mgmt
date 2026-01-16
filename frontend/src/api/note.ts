import axios from 'axios'

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? ''



export const createNote = async (payload: any): Promise<any> => {
  const res = await axios.post(`${API_BASE}/notes`, payload)
  return res.data
}

export const getNoteByEmail = async (): Promise<any> => {
  const res = await axios.get(`${API_BASE}/notes`)
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
