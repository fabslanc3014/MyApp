
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return res.json();
}

export const api = {
  login: (username: string, password: string) =>
    apiFetch('/ajax/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (data: Record<string, string>) =>
    apiFetch('/ajax/register', { method: 'POST', body: JSON.stringify(data) }),
  getUsers: () => apiFetch('/users'),
  getUser: (username: string) => apiFetch(`/users/${username}`),
  updateUser: (username: string, data: Record<string, string>) =>
    apiFetch(`/users/${username}/update`, { method: 'POST', body: JSON.stringify(data) }),
  deleteUser: (username: string) =>
    apiFetch('/users/delete', { method: 'POST', body: JSON.stringify({ username }) }),
};

export const auth = {
  getToken: () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null),
  setToken: (token: string) => localStorage.setItem('token', token),
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('usertype');
  },
  getUsername: () => (typeof window !== 'undefined' ? localStorage.getItem('username') : null),
  setUsername: (u: string) => localStorage.setItem('username', u),
  setUsertype: (t: string) => localStorage.setItem('usertype', t),
  isAuthenticated: () => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return t !== null && t !== '';
  },
};

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function computeAge(birthday: string): string {
  const dob = new Date(birthday);
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  if (months < 0) { years--; months += 12; }
  return `${years} yrs, ${months} mos, ${days} days`;
}