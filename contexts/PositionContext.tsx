'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserProfile = {
  name: string;
  position: string;
  phone: string;
  email: string;
  linkedin: string;
};

type UserProfileContextType = {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  // Legacy compatibility
  position: string;
  setPosition: (position: string) => void;
};

const defaultProfile: UserProfile = {
  name: 'Dung Hoang',
  position: 'COO',
  phone: '0977 096 665',
  email: 'dungbk811@gmail.com',
  linkedin: 'https://linkedin.com/in/dung-hoang-18092654',
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function PositionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    // Load profile from localStorage on mount
    const savedProfile = localStorage.getItem('user-profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to parse user profile:', e);
      }
    }
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      localStorage.setItem('user-profile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  // Legacy compatibility
  const setPosition = (newPosition: string) => {
    updateProfile({ position: newPosition });
  };

  return (
    <UserProfileContext.Provider value={{
      profile,
      updateProfile,
      position: profile.position,
      setPosition
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function usePosition() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('usePosition must be used within a PositionProvider');
  }
  return context;
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a PositionProvider');
  }
  return context;
}
