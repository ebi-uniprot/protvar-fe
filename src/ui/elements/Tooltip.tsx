import React, { FC, AllHTMLAttributes, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

/**
 * Portal-based tooltip. API-compatible with the balloon-css `Tool` (tip/pos/el
 * + passthrough html props) so it can be a drop-in swap, but the tip is rendered
 * in a portal on document.body with position:fixed — so it escapes scroll/overflow
 * containers (e.g. the result grid) instead of being clipped.
 */
type Props = {
  pos?: string;   // kept for API compatibility; placement is auto (flips/clamps)
  tip?: string;
  tSize?: string; // kept for API compatibility (unused)
  el?: string;
} & AllHTMLAttributes<HTMLElement>;

const HALF_MAX = 130; // ~half the tooltip max-width, for viewport-edge clamping

const Tooltip: FC<Props> = (props) => {
  const { pos, tip, tSize, el, onMouseEnter, onMouseLeave, onFocus, onBlur, children, ...rest } = props;
  const ref = useRef<HTMLElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; below: boolean } | null>(null);

  const open = useCallback(() => {
    const node = ref.current;
    if (!tip || !node) return;
    const r = node.getBoundingClientRect();
    const x = Math.min(Math.max(r.left + r.width / 2, HALF_MAX + 6), window.innerWidth - HALF_MAX - 6);
    const below = r.top < 64; // flip below the element when too close to the viewport top
    setCoords({ x, y: below ? r.bottom : r.top, below });
  }, [tip]);

  const close = useCallback(() => setCoords(null), []);

  const tipNode: React.ReactNode = tip && coords
    ? (createPortal(
        <span
          role="tooltip"
          className={`pv-tip${coords.below ? ' pv-tip--below' : ''}`}
          style={{ left: coords.x, top: coords.y }}
        >
          {tip}
        </span>,
        document.body
      ) as unknown as React.ReactNode)
    : null;

  return React.createElement(
    el || 'span',
    {
      ...rest,
      ref,
      'aria-label': tip || (rest as any)['aria-label'],
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { open(); (onMouseEnter as any)?.(e); },
      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { close(); (onMouseLeave as any)?.(e); },
      onFocus: (e: React.FocusEvent<HTMLElement>) => { open(); (onFocus as any)?.(e); },
      onBlur: (e: React.FocusEvent<HTMLElement>) => { close(); (onBlur as any)?.(e); },
    },
    children,
    tipNode
  );
};

export default Tooltip;
