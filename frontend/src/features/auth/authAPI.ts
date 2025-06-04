import axios from 'axios';

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
  return res.data;
};