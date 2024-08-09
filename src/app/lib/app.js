// lib/api.js
const API_BASE = '/api';

export async function fetchQuestions() {
  const res = await fetch(`${API_BASE}/questions`);

  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

export async function answerQuestion(id) {
  const res = await fetch(`${API_BASE}/questions`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to answer question');
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function createUser(wallet, points) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet, points }),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}