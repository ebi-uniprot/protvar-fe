import React, {useState} from "react";
import { useStats } from "../../../context/StatsContext";
import {Stats} from "../../../types/Stats";
import {formatNumber} from "./StatsTable";

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

  // State to track expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  return (
    <div className="stats-container">
      <h6>Stats Grouped by {groupBy}</h6>
      {Object.entries(groupedStats).map(([groupKey, stats]) => (
        <div key={groupKey} className="group-section">
          <h6 className="group-header" onClick={() => toggleGroup(groupKey)} style={{ cursor: "pointer", color: "gray" }}>
            {groupKey} {expandedGroups[groupKey] ? "▼" : "▶"}
          </h6>
          {expandedGroups[groupKey] && (
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
          )}
        </div>
      ))}
    </div>
  );
};