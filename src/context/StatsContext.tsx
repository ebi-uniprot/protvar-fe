import React, {createContext, useContext, useEffect, useState} from "react";
import {fetchStats} from "../services/StatsService";
import {ReleaseStat} from "../types/Stats";

interface StatsContextType {
  stats: ReleaseStat[]                          // in display order
  getStat: (key: string) => ReleaseStat | undefined
  error: boolean
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [stats, setStats] = useState<ReleaseStat[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch((e) => {
        console.error(e);
        setError(true);
      });
  }, []);

  const byKey = new Map(stats.map(s => [s.key, s]));
  const getStat = (key: string) => byKey.get(key);
  return <StatsContext.Provider value={{stats, getStat, error}}>{children}</StatsContext.Provider>;
};

export const useStats = (): StatsContextType => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
};
