/**
 * Side-by-side ball-and-stick comparison of the reference and alternate amino
 * acid, each in its own minimal molstar-core viewer. Auto-spin can be toggled;
 * bumping resetNonce returns both to their initial framing. Presentational:
 * structures come from the bundled SDF assets via residueSdfUrl.
 */
import React, { useEffect, useRef, useState } from 'react';
import { ResidueViewer } from './residueViewer';
import { residueSdfUrl } from './residueSdf';

interface AminoAcidCompareProps {
  /** Three-letter residue codes (any case), e.g. "ALA" / "ser". */
  refCode: string;
  altCode: string;
  refName?: string;
  altName?: string;
  height?: number;
  /** Auto-spin both viewers (controlled by the parent). */
  spin?: boolean;
  /** Bump to reset both viewers to their initial framing. */
  resetNonce?: number;
}

export default function AminoAcidCompare({
  refCode,
  altCode,
  refName,
  altName,
  height = 240,
  spin = true,
  resetNonce = 0,
}: AminoAcidCompareProps) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refContainer = useRef<HTMLDivElement>(null);
  const altCanvas = useRef<HTMLCanvasElement>(null);
  const altContainer = useRef<HTMLDivElement>(null);
  const viewersRef = useRef<{ ref: ResidueViewer; alt: ResidueViewer } | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Mount + load whenever the residue pair changes.
  useEffect(() => {
    let cancelled = false;
    const refUrl = residueSdfUrl(refCode);
    const altUrl = residueSdfUrl(altCode);
    if (!refUrl || !altUrl) {
      setError('No 3D structure available for this residue.');
      return;
    }
    if (!refCanvas.current || !refContainer.current || !altCanvas.current || !altContainer.current) {
      return;
    }
    setError(null);

    const vRef = new ResidueViewer();
    const vAlt = new ResidueViewer();

    (async () => {
      try {
        await vRef.mount(refCanvas.current!, refContainer.current!);
        await vAlt.mount(altCanvas.current!, altContainer.current!);
        if (cancelled) return;
        await vRef.load(refUrl);
        await vAlt.load(altUrl);
        if (cancelled) return;
        vRef.setSpin(spin);
        vAlt.setSpin(spin);
        viewersRef.current = { ref: vRef, alt: vAlt };
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancelled = true;
      vRef.dispose();
      vAlt.dispose();
      viewersRef.current = null;
    };
    // spin read via closure on mount; later changes handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refCode, altCode]);

  useEffect(() => {
    const vs = viewersRef.current;
    vs?.ref.setSpin(spin);
    vs?.alt.setSpin(spin);
  }, [spin]);

  // Reset both viewers to their initial framing when the nonce changes.
  useEffect(() => {
    if (!resetNonce) return;
    const vs = viewersRef.current;
    vs?.ref.reset();
    vs?.alt.reset();
  }, [resetNonce]);

  const pane = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    containerRef: React.RefObject<HTMLDivElement>,
    label: string,
  ) => (
    <div>
      <div ref={containerRef} style={{ position: 'relative', width: '100%', height }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>
      <div className="aa-model-label" style={{ textAlign: 'center', marginTop: 6 }}>{label}</div>
    </div>
  );

  return (
    <div className="aa-3d-compare">
      {error ? (
        <div className="aa-3d-error" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center' }}>
          {pane(refCanvas, refContainer, refName ?? refCode)}
          <i className="bi bi-chevron-right aa-change-arrow" />
          {pane(altCanvas, altContainer, altName ?? altCode)}
        </div>
      )}
    </div>
  );
}
