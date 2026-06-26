'use client';

import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { API_BASE } from './api';

const TOKEN_KEY = 'prelegal_token';
const EMAIL_KEY = 'prelegal_email';

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; email: string; token: string };

type AuthAction =
  | { type: 'HYDRATE'; token: string | null; email: string | null }
  | { type: 'SIGN_IN'; token: string; email: string }
  | { type: 'SIGN_OUT' };

function reducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'HYDRATE':
      return action.token && action.email
        ? { status: 'authenticated', token: action.token, email: action.email }
        : { status: 'unauthenticated' };
    case 'SIGN_IN':
      return { status: 'authenticated', token: action.token, email: action.email };
    case 'SIGN_OUT':
      return { status: 'unauthenticated' };
  }
}

type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { status: 'loading' });

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const email = localStorage.getItem(EMAIL_KEY);
    dispatch({ type: 'HYDRATE', token, email });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail ?? 'Invalid credentials');
    }
    const { access_token } = await res.json();
    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(EMAIL_KEY, email);
    dispatch({ type: 'SIGN_IN', token: access_token, email });
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail ?? 'Could not create account');
    }
    const { access_token } = await res.json();
    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(EMAIL_KEY, email);
    dispatch({ type: 'SIGN_IN', token: access_token, email });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    dispatch({ type: 'SIGN_OUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
