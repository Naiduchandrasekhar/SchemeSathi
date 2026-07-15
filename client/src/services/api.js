import axios from 'axios'
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api' })
export const extractProfile = (text) => api.post('/extract-profile', { text })
export const getRecommendations = (profile) => api.post('/recommend', profile)
