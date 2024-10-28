import React, {createContext, ReactNode} from "react";

const SET_ITEM = "SET_ITEM"

interface LocalStorageContextProps {
  getItem: <T>(key: string) => T | null;
  setItem: <T>(key: string, value: T) => void;
  removeItem: (key: string) => void;
}

const LocalStorageContext = createContext<LocalStorageContextProps | undefined>(undefined);

const LocalStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const getItem = <T,>(key: string): T | null => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  const setItem = <T,>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
    const event = new CustomEvent(SET_ITEM, { detail: key });
    window.dispatchEvent(event)
  };

  const removeItem = (key: string): void => {
    localStorage.removeItem(key);
  };

  return (
    <LocalStorageContext.Provider value={{ getItem: getItem, setItem: setItem, removeItem: removeItem }}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export { SET_ITEM, LocalStorageContext, LocalStorageProvider };