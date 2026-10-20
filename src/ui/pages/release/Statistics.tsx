import React from 'react';
import {useStats} from "../../../context/StatsContext";
import {ReleaseStat} from "../../../types/Stats";
import {STATS_CARDS, STATS_SECTIONS, StatsItem} from "../../../constants/statsLayout";

// Layout from constants/statsLayout; labels, values and versions from GET /stats.

export const formatNumber = (n?: number) => n === undefined ? '' : new Intl.NumberFormat().format(n);

// 266.6M for cards; full number below a million
const formatCompact = (n: number) => n >= 1_000_000
  ? new Intl.NumberFormat('en', {notation: 'compact', maximumFractionDigits: 1}).format(n)
  : formatNumber(n);

// "dbSNP / ClinVar" + "b157 / 2025-02" -> "dbSNP b157 · ClinVar 2025-02"
const sourceVersion = (s: ReleaseStat) => {
  if (!s.version) return s.source;
  const sources = s.source.split(' / '), versions = s.version.split(' / ');
  return sources.length > 1 && sources.length === versions.length
    ? sources.map((src, i) => `${src} ${versions[i]}`).join(' · ')
    : `${s.source} ${s.version}`;
};

const formatPercent = (part: number, total: number) =>
  new Intl.NumberFormat('en', {style: 'percent', maximumFractionDigits: 1}).format(part / total);

// Share (if the layout asks for one) and sub-figures (key.<sub>) shown under a number
function useSubLines() {
  const {stats, getStat} = useStats();
  return (item: StatsItem, s: ReleaseStat, format: (n: number) => string) => {
    const lines: string[] = [];
    const total = item.shareOf ? getStat(item.shareOf) : undefined;
    if (total?.value) lines.push(`${formatPercent(s.value, total.value)} of ${total.label}`);
    stats.filter(c => c.key.startsWith(s.key + '.') && !c.key.slice(s.key.length + 1).includes('.'))
      .forEach(c => lines.push(`${format(c.value)} ${c.label}`));
    return lines;
  };
}

const Statistics: React.FC = () => {
  const {stats, error} = useStats();
  if (error) return <p className="stats-empty">Statistics are not available right now.</p>;
  if (stats.length === 0) return null;
  return (
    <div className="statistics">
      <StatsGrid/>
      {STATS_SECTIONS.map(section => <StatsSection key={section.title} {...section}/>)}
    </div>
  );
};

export function StatsGrid() {
  const {getStat} = useStats();
  const subLines = useSubLines();
  return <div className="grid-container">
    {STATS_CARDS.map(item => {
      const s = getStat(item.key);
      if (!s) return null;
      const lines = subLines(item, s, formatCompact);
      return <StatsCard key={s.key} label={s.label} value={formatCompact(s.value)}
                        title={`${formatNumber(s.value)}: ${s.description}`}
                        sub={lines.length ? lines.map((l, i) => <div key={i}>{l}</div>) : s.source}/>;
    })}
  </div>
}

function StatsSection({title, groups}: typeof STATS_SECTIONS[number]) {
  const {getStat} = useStats();
  const subLines = useSubLines();
  return (
    <div className="stats-container">
      <h6>{title}</h6>
      <table className="stats-table">
        <thead>
        <tr>
          <th>Data</th>
          <th>Number</th>
          <th>Source</th>
        </tr>
        </thead>
        <tbody>
        {groups.map(group => <React.Fragment key={group.title}>
          <tr className="stats-group">
            <td colSpan={3}>{group.title}</td>
          </tr>
          {group.items.map(item => {
            const s = getStat(item.key);
            if (!s) return null;
            return <tr key={s.key}>
              <td title={s.description}>{s.label}</td>
              <td>
                {formatNumber(s.value)}
                {subLines(item, s, formatNumber).map((l, i) => <div key={i} className="stats-sub">{l}</div>)}
              </td>
              <td>{sourceVersion(s)}</td>
            </tr>;
          })}
        </React.Fragment>)}
        </tbody>
      </table>
    </div>
  );
}

interface StatsCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  title?: string;
}

export function StatsCard({label, value, sub, title}: StatsCardProps) {
  return <div className="stat-card" title={title}>
    <div className="stat-card-label">{label}</div>
    <div className="stat-card-value">{value}</div>
    {sub && <div className="stat-card-sub">{sub}</div>}
  </div>;
}

export default Statistics;
