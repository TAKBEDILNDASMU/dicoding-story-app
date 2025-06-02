const TOKEN_EXPIRY_MS = 2 * 60 * 60 * 1000;

export function storeAuthToken(token) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('token_issued_at', `${Date.now()}`);
}

export function getAuthToken() {
  if (!isTokenValid()) return null;
  return localStorage.getItem('auth_token');
}

function isTokenValid() {
  const issuedAt = parseInt(localStorage.getItem('token_issued_at'));
  if (!issuedAt) return false;

  const now = Date.now();
  return now - issuedAt < TOKEN_EXPIRY_MS;
}
