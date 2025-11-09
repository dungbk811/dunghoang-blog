'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type PositionContextType = {
  position: string;
  setPosition: (position: string) => void;
};

const PositionContext = createContext<PositionContextType | undefined>(undefined);

export function PositionProvider({ children }: { children: ReactNode }) {
  const [position, setPositionState] = useState('COO');

  useEffect(() => {
    // Load position from localStorage on mount
    const savedPosition = localStorage.getItem('user-position');
    if (savedPosition) {
      setPositionState(savedPosition);
    }
  }, []);

  const setPosition = (newPosition: string) => {
    setPositionState(newPosition);
    localStorage.setItem('user-position', newPosition);
  };

  return (
    <PositionContext.Provider value={{ position, setPosition }}>
      {children}
    </PositionContext.Provider>
  );
}

export function usePosition() {
  const context = useContext(PositionContext);
  if (context === undefined) {
    throw new Error('usePosition must be used within a PositionProvider');
  }
  return context;
}
