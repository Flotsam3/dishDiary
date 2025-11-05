export const fetchWithAuth = async (url, options = {}) => {
  // Use credentials: 'include' so browser sends http-only cookies
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...options.headers
    }
  });

  if (response.status === 401) {
    // clear client-side state by navigating to auth page
    try { window.location.href = '/auth'; } catch (e) { /* ignore */ }
    throw new Error('Unauthorized');
  }

  return response;
};

export const api = {
  get: (url) => fetchWithAuth(url),

  post: (url, data) => fetchWithAuth(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }),

  put: (url, data) => fetchWithAuth(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }),

  delete: (url) => fetchWithAuth(url, {
    method: 'DELETE'
  })
};