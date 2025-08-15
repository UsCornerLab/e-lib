
import axios from "axios";

const API_URL = "http://localhost:8000/api"; 

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export async function login(credentials: LoginCredentials) {
  const response = await axios.post(`${API_URL}/login`, credentials, {
    withCredentials: true, 
  });
  return response.data; 
}

export async function logout() {
  await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
}
