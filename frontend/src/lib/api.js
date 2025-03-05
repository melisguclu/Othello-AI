import axios from 'axios';

export const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: 'https://othello-ai-47843670726.europe-west1.run.app',
  withCredentials: true,
});
