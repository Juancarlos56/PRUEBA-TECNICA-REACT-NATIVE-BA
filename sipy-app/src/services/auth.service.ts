import { API_BASE_URL } from '../constants';
import { AuthUser } from '../types';

export const loginService = async (
  username: string,
  password: string
): Promise<AuthUser> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 30 }),
  });

  if (!response.ok) throw new Error('Error al iniciar sesión');

  return response.json();
};

export const getMeService = async (token: string): Promise<AuthUser> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('Sesión inválida');

  return response.json();
};
