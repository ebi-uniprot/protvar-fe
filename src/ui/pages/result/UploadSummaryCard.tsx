import { UploadSummary } from "../../../types/PagedMappingResponse";

// What happened to an upload's lines. Lines and formats show at once; the mapped / not mapped / notes counts
// once the upload is prepared (a progress line meanwhile). The counts are links that filter the lines.
export function UploadSummaryCard({ summary, matching, onShowNotes, onShowNotMapped }: {
  summary: UploadSummary;
  matching?: number | null;    // with filters on: lines that match them (the page total)
  onShowNotes: () => void;     // lines with any note
  onShowNotMapped?: () => void; // lines without a result (their error codes); absent when there are none
}) {
  const formats = Object.entries(summary.formats ?? {})
    .map(([name, n]) => `${name} ${n.toLocaleString()}`).join(' · ');
  return (
    <div className="upload-summary">
      {matching != null && (
        <span className="upload-summary__matching">
          <span className="upload-summary__n">{matching.toLocaleString()}</span> of {summary.lines.toLocaleString()} lines
          match the filters
        </span>
      )}
      <Stat n={summary.lines} label={summary.lines === 1 ? 'line' : 'lines'} />
      {summary.mapped != null ? (
        <>
          <Stat n={summary.mapped} label="mapped" />
          <Stat n={summary.notMapped ?? 0} label="not mapped" tone="error"
                onClick={summary.notMapped ? onShowNotMapped : undefined} />
          <Stat n={summary.withNotes ?? 0} label="with notes" tone="warn"
                onClick={summary.withNotes ? onShowNotes : undefined} />
        </>
      ) : summary.preparing != null && (
        <span className="upload-summary__preparing" role="status">
          <span className="upload-summary__bar"><span style={{ width: `${summary.preparing}%` }} /></span>
          Checking every line… {summary.preparing}%. Mapped and notes counts follow; the results below are ready.
        </span>
      )}
      {formats && <span className="upload-summary__formats">{formats}</span>}
    </div>
  );
}

function Stat({ n, label, tone, onClick }: { n: number; label: string; tone?: 'warn' | 'error'; onClick?: () => void }) {
  const body = <><span className="upload-summary__n">{n.toLocaleString()}</span> {label}</>;
  const cls = `upload-summary__stat${tone ? ` upload-summary__stat--${tone}` : ''}`;
  return onClick
    ? <button type="button" className={`${cls} upload-summary__stat--link`} onClick={onClick}
              title={`Show the ${label} lines`}>{body}</button>
    : <span className={cls}>{body}</span>;
}
