const BASE_URL = process.env.REACT_APP_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export const taskApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tasks${query ? `?${query}` : ''}`);
  },

  create: (task) =>
    request('/tasks', { method: 'POST', body: JSON.stringify(task) }),

  update: (id, changes) =>
    request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),

  remove: (id) =>
    request(`/tasks/${id}`, { method: 'DELETE' }),
};
