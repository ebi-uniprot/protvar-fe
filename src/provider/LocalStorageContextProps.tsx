import React, { createContext, useContext, ReactNode } from 'react';

interface LocalStorageContextProps {
  getValue: <T>(key: string) => T | null;
  setValue: <T>(key: string, value: T) => void;
  deleteValue: (key: string) => void;
}

const LocalStorageContext = createContext<LocalStorageContextProps | undefined>(undefined);

export const useLocalStorageContext = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error('useLocalStorageContext must be used within a LocalStorageProvider');
  }
  return context;
};

export const LOCAL_STORAGE_SET = "localStore"

export const LocalStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const getValue = <T,>(key: string): T | null => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  const setValue = <T,>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
    const event = new CustomEvent(LOCAL_STORAGE_SET, { detail: key });
    window.dispatchEvent(event)
  };

  const deleteValue = (key: string): void => {
    localStorage.removeItem(key);
  };

  return (
    <LocalStorageContext.Provider value={{ getValue, setValue, deleteValue }}>
      {children}
    </LocalStorageContext.Provider>
  );
};