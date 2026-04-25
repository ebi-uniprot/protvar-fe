import React from 'react';
import { Link } from 'react-router-dom';

interface Tile {
  icon: string;
  title: string;
  pattern: string;
  example: string;
  href: string;
  isNew?: boolean;
}

const TILES: Tile[] = [
  {
    icon: 'bi-geo-alt',
    title: 'Variant by genomic position',
    pattern: '/g/{chr}/{pos}/{ref}/{alt}',
    example: '/g/19/1010539/G/C',
    href: '/g/19/1010539/G/C',
  },
  {
    icon: 'bi-activity',
    title: 'Variant by amino acid change',
    pattern: '/p/{acc}/{pos}/{ref_aa}/{alt_aa}',
    example: '/p/Q4ZIN3/558/S/R',
    href: '/p/Q4ZIN3/558/S/R',
  },
  {
    icon: 'bi-search',
    title: 'Free-text variant search',
    pattern: '/search?q={variant}',
    example: '/search?q=rs864622779',
    href: '/search?q=rs864622779',
  },
  {
    icon: 'bi-list-ul',
    title: 'Browse all variants in a protein',
    pattern: '/p/{acc}',
    example: '/p/Q4ZIN3',
    href: '/p/Q4ZIN3',
  },
  {
    icon: 'bi-arrows-expand',
    title: 'Browse a protein region',
    pattern: '/p/{acc}/{start}-{end}',
    example: '/p/Q4ZIN3/100-200',
    href: '/p/Q4ZIN3/100-200',
    isNew: true,
  },
  {
    icon: 'bi-diagram-2',
    title: 'Browse by gene or identifier',
    pattern: '/gene/{symbol}',
    example: '/gene/BRCA1',
    href: '/gene/BRCA1',
  },
];

export const ProtVarLinksCard: React.FC = () => (
  <div className="pv-links-card">
    <div className="pv-links-header">
      <i className="bi bi-link-45deg" />
      <span>Direct Access Patterns</span>
      <span className="pv-links-sub">Bookmark or share these URLs to jump straight to any ProtVar view</span>
    </div>
    <div className="pv-links-grid">
      {TILES.map((tile) => (
        <Link key={tile.href} to={tile.href} className="pv-link-tile">
          <div className="pv-tile-icon"><i className={`bi ${tile.icon}`} /></div>
          <div className="pv-tile-body">
            <div className="pv-tile-title">
              {tile.title}
              {tile.isNew && <span className="pv-tile-new">new</span>}
            </div>
            <code className="pv-tile-pattern">{tile.pattern}</code>
            <div className="pv-tile-example">{tile.example}</div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);
