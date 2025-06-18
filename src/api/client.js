import axios from 'axios';

const API_URL = 'http://localhost:3000';
const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const user = localStorage.getItem('userInfo');
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default client;
