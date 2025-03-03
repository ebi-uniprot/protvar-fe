import React from "react";
import { useStats } from "../../../context/StatsContext";
import {Stats} from "../../../types/Stats";

/*
interface StatsDisplayProps {
  keyName: string;
}

const StatsDisplay: React.FC<StatsDisplayProps> = (props:{ keyName: string }) => {
  const { statsMap } = useStats();

  // Access stats by their key name
  const stats = statsMap.get(props.keyName);

  return (
    <div className="stats-container">
      <ul>
        {stats && (
          <li>
            <strong>{stats.keyName}:</strong> {stats.value}{" "}
            {stats.note && `(${stats.note})`}
          </li>
        )}
      </ul>
    </div>
  );
};
*/

// Define the GroupedStats type explicitly
type GroupedStats = Record<string, Stats[]>;

interface StatsDisplayGroupProps {
  groupBy: keyof Stats; // Ensures groupBy is a valid key of Stat
}

export const StatsDisplayGroup: React.FC<StatsDisplayGroupProps> = ({ groupBy }) => {
  const { statsMap } = useStats();

  // Convert statsMap into an array for easy manipulation
  const statsArray: Stats[] = Array.from(statsMap.values());

  // Group stats by the selected key (datasetType or importType)
  const groupedStats: GroupedStats = statsArray.reduce<GroupedStats>((groups, stat) => {
    const groupKey = String(stat[groupBy]) || "No Group"; // Ensure groupKey is always a string

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(stat);
    return groups;
  }, {});

  // Helper function to format numbers with commas
  const formatNumber = (number: number) => {
    return new Intl.NumberFormat().format(number);
  };

  return (
    <div className="stats-container">
      <h6>Latest Stats Grouped by {groupBy}</h6>
      {Object.entries(groupedStats).map(([groupKey, stats]) => (
        <div key={groupKey} className="group-section">
          <h6>{groupKey}</h6>
          <table className="stats-table">
            <thead>
            <tr>
              <th>Import Type</th>
              <th>Key Name</th>
              <th>Value</th>
              <th>Note</th>
              <th>Created At</th>
            </tr>
            </thead>
            <tbody>
            {stats.map((stat) => (
              <tr key={stat.keyName}>
                <td>{stat.importType}</td>
                <td>{stat.keyName}</td>
                <td>{formatNumber(stat.value)}</td>
                <td>{stat.note || "-"}</td>
                <td>{new Date(stat.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};