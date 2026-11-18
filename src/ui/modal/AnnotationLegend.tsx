import { Activity, Box, Users } from 'lucide-react';

// The result row's annotation buttons (same icons and square style), and what each one opens
const ITEMS = [
  { Icon: Activity, name: 'Function', text: 'functional annotations, predictions, pockets and interfaces' },
  { Icon: Users, name: 'Population', text: 'the variant and co-located variants in public databases' },
  { Icon: Box, name: 'Structure', text: 'experimental and AlphaFold 3D structures' },
];

function AnnotationLegend() {
  return (
    <ul className="annotation-legend">
      {ITEMS.map(({ Icon, name, text }) => (
        <li key={name}>
          <span className="annotation-btn" aria-hidden="true"><Icon size={18} strokeWidth={1.75} /></span>
          <span><strong>{name}</strong> — {text}</span>
        </li>
      ))}
    </ul>
  );
}

export default AnnotationLegend
