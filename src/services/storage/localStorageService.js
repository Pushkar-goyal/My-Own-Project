const VAULT_PROFILE_KEY = 'citizen_vault_profile_v1';
const VAULT_PIN_KEY = 'citizen_vault_pin_v1';

export const localStorageService = {
  getProfile: () => {
    try {
      const data = localStorage.getItem(VAULT_PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to read profile from localStorage:', e);
      return null;
    }
  },

  saveProfile: (profile) => {
    try {
      localStorage.setItem(VAULT_PROFILE_KEY, JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
      return false;
    }
  },

  getVaultPIN: () => {
    return localStorage.getItem(VAULT_PIN_KEY);
  },

  setVaultPIN: (pin) => {
    if (!pin) {
      localStorage.removeItem(VAULT_PIN_KEY);
    } else {
      localStorage.setItem(VAULT_PIN_KEY, pin);
    }
  },

  clearVault: () => {
    localStorage.removeItem(VAULT_PROFILE_KEY);
    localStorage.removeItem(VAULT_PIN_KEY);
  }
};
