import {API_URL} from "../constants/const";
import {ReleaseStat} from "../types/Stats";

export async function fetchStats(): Promise<ReleaseStat[]> {
  const response = await fetch(`${API_URL}/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}
