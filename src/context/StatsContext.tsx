// src/context/StatsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchLatestStats } from "../services/StatsService";
import {Stats} from "../types/Stats";

interface StatsContextType {
  statsMap: Map<string, Stats>
  // previousStatsMap: Map<string, Stats>
  getStat: (key: string) => Stats | undefined
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statsMap, setStatsMap] = useState<Map<string, Stats>>(new Map());
  //const [previousStatsMap, setPreviousStatsMap] = useState<Map<string, Stats>>(new Map());

  useEffect(() => {
    fetchLatestStats()
      .then((stats) => {
        // Convert the array of stats to a map using keyName as the key
        const map = new Map(stats.map((stat) => [stat.key, stat]));
        setStatsMap(map);
      })
      .catch(console.error);
  }, []); // Runs only once when the component mounts

  const getStat = (key: string) => statsMap.get(key)
  return <StatsContext.Provider value={{ statsMap, getStat }}>{children}</StatsContext.Provider>;
};

export const useStats = (): StatsContextType => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
};