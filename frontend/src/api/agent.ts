import axios from "axios";

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

export interface AgentPayload {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
}

export const createAgent = async (payload: AgentPayload): Promise<any> => {
  const res = await axios.post(`${API_BASE}/agents`, payload);
  return res.data;
};

export default { createAgent }