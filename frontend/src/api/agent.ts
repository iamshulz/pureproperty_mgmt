import axios from "axios";

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

export interface AgentPayload {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
}

export interface AgentResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createAgent = async (payload: AgentPayload): Promise<any> => {
  const res = await axios.post(`${API_BASE}/agents`, payload);
  return res.data;
};

export const getAllAgents = async (): Promise<any> => {
  const res = await axios.get(`${API_BASE}/agents`);
  return res.data;
}

export const deleteAgent = async (id: string): Promise<any> => {
  const res = await axios.delete(`${API_BASE}/agents/${id}`);
  return res.data;
}

export const updateAgent = async (id: string, payload: AgentPayload): Promise<AgentResponse> => {
  const res = await axios.put(`${API_BASE}/agents/${id}`, payload)
  return res.data
}

export default { createAgent, getAllAgents, deleteAgent, updateAgent }