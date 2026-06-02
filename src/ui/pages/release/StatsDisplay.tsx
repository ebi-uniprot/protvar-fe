import React from "react";
import { useStats } from "../../../context/StatsContext";
import {Stats} from "../../../types/Stats";
import {formatNumber} from "./StatsTable";
import {ReleaseNote} from "./ReleaseNote";

// Define the GroupedStats type explicitly
type GroupedStats = Record<string, Stats[]>;

interface StatsDisplayGroupProps {
  groupBy: keyof Stats; // Ensures groupBy is a valid key of Stat
}

export const StatsDisplayGroup: React.FC<StatsDisplayGroupProps> = ({ groupBy }) => {
  const { statsMap } = useStats();
  const statsArray: Stats[] = Array.from(statsMap.values());

  // Group stats by stats type
  const groupedStats: GroupedStats = statsArray.reduce<GroupedStats>((groups, stat) => {
    const groupKey = String(stat[groupBy]) || "No Group"; // Ensure groupKey is always a string
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(stat);
    return groups;
  }, {});

  return (
    <div className="stats-container">
      <h6>All statistics by {String(groupBy)}</h6>
      <div className="release-notes">
        {Object.entries(groupedStats).map(([groupKey, stats]) => (
          <ReleaseNote
            key={groupKey}
            title={<>{groupKey} <small>{stats.length}</small></>}
          >
            <table className="stats-table">
              <thead>
              <tr>
                <th>Key</th>
                <th>Number</th>
                <th>Note</th>
                <th>Created</th>
              </tr>
              </thead>
              <tbody>
              {stats.map((stat) => (
                <tr key={stat.key}>
                  <td>{stat.key}</td>
                  <td>{formatNumber(stat.value)}</td>
                  <td>{stat.note || "-"}</td>
                  <td>{new Date(stat.created).toLocaleString()}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </ReleaseNote>
        ))}
      </div>
    </div>
  );
};
