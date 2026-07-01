export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function redirectToLogin() {
  window.location.href = '/login';
}

export function redirectToUnauthorized() {
  window.location.href = '/unauthorized';
}
