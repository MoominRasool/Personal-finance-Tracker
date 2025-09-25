import axios from 'axios'

const API_BASE = (import.meta?.env?.VITE_API_URL || 'http://localhost:4000') + '/api'

export const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem('token', data.token)
  return data
}

export async function register(name, email, password) {
  const { data } = await api.post('/auth/register', { name, email, password })
  localStorage.setItem('token', data.token)
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data.user
}

export async function getExpenses() {
  const { data } = await api.get('/expenses')
  return data.items
}

export async function createExpense(payload) {
  const { data } = await api.post('/expenses', payload)
  return data.item
}

export async function updateExpense(id, payload) {
  const { data } = await api.put(`/expenses/${id}`, payload)
  return data.item
}

export async function deleteExpense(id) {
  await api.delete(`/expenses/${id}`)
}

export async function getBudgets() {
  const { data } = await api.get('/budgets')
  return data.items
}

export async function createBudget(payload) {
  const { data } = await api.post('/budgets', payload)
  return data.item
}

export async function updateBudget(id, payload) {
  const { data } = await api.put(`/budgets/${id}`, payload)
  return data.item
}

export async function deleteBudget(id) {
  await api.delete(`/budgets/${id}`)
}

export async function getSpendByCategory(params) {
  const { data } = await api.get('/reports/category', { params })
  return data.items
}

export async function getSpendByMonth(params) {
  const { data } = await api.get('/reports/month', { params })
  return data.items
}


