// src/services/statsService.ts
import {API_URL} from "../constants/const";
import {Stats} from "../types/Stats";

export async function fetchLatestStats(): Promise<Stats[]> {
  const response = await fetch(`${API_URL}/stats/latest`);
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}

// Fetch Core Stats
/*
const fetchCoreStats = async () => {
  const response = await fetch(`${API_URL}/stats/core`);
  const stats = await response.json();
  console.log(stats);
};
*/