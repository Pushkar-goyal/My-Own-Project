import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const ACCOUNTS_KEY = 'bharat_sathi_accounts_v1';
const SESSION_KEY = 'bharat_sathi_session_v1';
const BIOMETRIC_KEY = 'bharat_sathi_biometric_v1';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const createId = () => {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const isValidEmail = (email) => EMAIL_PATTERN.test(email.trim().toLowerCase());

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(SESSION_KEY, null));

  const saveSession = (account) => {
    const session = {
      id: account.id,
      name: account.name,
      email: account.email,
      phone: account.phone
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  };

  const signup = ({ name, email, phone, password }) => {
    const accounts = readJson(ACCOUNTS_KEY, []);
    if (!isValidEmail(email))
      return { ok: false, error: 'Enter a valid email address, such as name@example.com.' };
    const normalizedEmail = email.trim().toLowerCase();
    if (accounts.some((account) => account.email === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const account = {
      id: createId(),
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password
    };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
    saveSession(account);
    return { ok: true };
  };

  const login = ({ email, password }) => {
    if (!isValidEmail(email))
      return { ok: false, error: 'Enter a valid email address, such as name@example.com.' };
    const account = readJson(ACCOUNTS_KEY, []).find(
      (item) => item.email === email.trim().toLowerCase() && item.password === password
    );
    if (!account) return { ok: false, error: 'Email or password is incorrect.' };
    saveSession(account);
    return { ok: true };
  };

  const socialSignup = (provider, { email, name } = {}) => {
    const accounts = readJson(ACCOUNTS_KEY, []);
    const providerEmail = isValidEmail(email || '')
      ? email.trim().toLowerCase()
      : provider === 'Google'
        ? 'google-user@gmail.com'
        : `${provider.toLowerCase().replace(/\s+/g, '-')}@demo.bharatsathi.local`;
    const existingAccount = accounts.find((account) => account.email === providerEmail);
    if (existingAccount) {
      saveSession(existingAccount);
      return { ok: true, demo: true };
    }

    const account = {
      id: createId(),
      name: name?.trim() || `${provider} Citizen`,
      email: providerEmail,
      phone: '',
      password: createId(),
      provider
    };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
    saveSession(account);
    return { ok: true, demo: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const registerBiometric = async () => {
    if (!window.PublicKeyCredential || !navigator.credentials) {
      return { ok: false, error: 'Biometric sign-in is not supported in this browser.' };
    }
    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: { name: 'Bharat Sathi AI' },
          user: { id: new TextEncoder().encode(user.id), name: user.email, displayName: user.name },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 }
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          },
          timeout: 60000
        }
      });
      if (!credential) return { ok: false, error: 'Biometric setup was cancelled.' };
      localStorage.setItem(
        BIOMETRIC_KEY,
        JSON.stringify({
          email: user.email,
          credentialId: Array.from(new Uint8Array(credential.rawId))
        })
      );
      return { ok: true };
    } catch {
      return { ok: false, error: 'Biometric setup was cancelled or blocked by the browser.' };
    }
  };

  const biometricLogin = async () => {
    const saved = readJson(BIOMETRIC_KEY, null);
    if (!saved || !window.PublicKeyCredential || !navigator.credentials) {
      return { ok: false, error: 'Set up biometric sign-in on this device first.' };
    }
    try {
      await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          allowCredentials: [{ type: 'public-key', id: new Uint8Array(saved.credentialId) }],
          userVerification: 'required',
          timeout: 60000
        }
      });
      const account = readJson(ACCOUNTS_KEY, []).find((item) => item.email === saved.email);
      if (!account) return { ok: false, error: 'The saved account is no longer available.' };
      saveSession(account);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Biometric verification failed or was cancelled.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        signup,
        login,
        socialSignup,
        logout,
        registerBiometric,
        biometricLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
