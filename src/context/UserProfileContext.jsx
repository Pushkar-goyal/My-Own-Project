import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageService } from '../services/storage/localStorageService';

const UserProfileContext = createContext();

const defaultSeedProfile = {};

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorageService.getProfile();
    // Remove the old sample persona so demo identity and income never affect real scheme matches.
    if (saved?.email === 'rajesh.sharma@example.com' || saved?.fullName === 'Rajesh Kumar Sharma') {
      localStorageService.clearVault();
      localStorage.removeItem('scheme_form_draft_v1');
      return defaultSeedProfile;
    }
    return saved || defaultSeedProfile;
  });

  const [formDraft, setFormDraft] = useState(() => {
    try {
      const draft = localStorage.getItem('scheme_form_draft_v1');
      return draft ? JSON.parse(draft) : profile;
    } catch (e) {
      return profile;
    }
  });

  const [isVaultLocked, setIsVaultLocked] = useState(() => {
    return Boolean(localStorageService.getVaultPIN());
  });

  useEffect(() => {
    localStorageService.saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('scheme_form_draft_v1', JSON.stringify(formDraft));
    } catch (e) {
      console.error('Draft save failed:', e);
    }
  }, [formDraft]);

  const updateProfile = (updatedFields) => {
    setProfile(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const updateFormDraft = (updatedFields) => {
    setFormDraft(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const importProfileData = (jsonObj) => {
    if (jsonObj && typeof jsonObj === 'object') {
      setProfile(jsonObj);
      setFormDraft(jsonObj);
      return true;
    }
    return false;
  };

  const clearAllVaultProfile = () => {
    localStorageService.clearVault();
    setProfile({});
    setFormDraft({});
  };

  const lockVaultWithPIN = (pin) => {
    localStorageService.setVaultPIN(pin);
    setIsVaultLocked(true);
  };

  const unlockVaultWithPIN = (inputPin) => {
    const savedPin = localStorageService.getVaultPIN();
    if (inputPin === savedPin) {
      setIsVaultLocked(false);
      return true;
    }
    return false;
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        updateProfile,
        formDraft,
        updateFormDraft,
        importProfileData,
        clearAllVaultProfile,
        isVaultLocked,
        lockVaultWithPIN,
        unlockVaultWithPIN,
        defaultSeedProfile
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfile = () => useContext(UserProfileContext);
