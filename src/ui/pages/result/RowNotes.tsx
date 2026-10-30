import { Message, MessageType } from "../../../types/MappingResponse";
import Tool from "../../elements/Tooltip";

// Notes (BE messages) on an input that has result rows: a corner marker on its first row, and a
// one-line note row under it when opened. Inputs without rows keep their own message row (MsgRow).

const SEVERITY: MessageType[] = ['ERROR', 'WARN', 'INFO'];

export const worstType = (messages: Message[]): MessageType =>
  SEVERITY.find(t => messages.some(m => m.type === t)) ?? 'INFO';

const noteText = (m: Message) => (m.code ? `${m.code} ${m.text}` : m.text);

export function NoteMarker({ messages, open, onToggle }: {
  messages: Message[]; open: boolean; onToggle: () => void;
}) {
  const type = worstType(messages).toLowerCase();
  const tip = messages.map(noteText).join(' · ');
  return (
    <Tool el="button" tip={tip} pos="up-left"
          className={`note-marker note-marker--${type}`}
          aria-expanded={open}
          onClick={onToggle} />
  );
}

// One note: the code (if catalogued) then the text. Shared by note rows and message rows.
export const NoteText = ({ message }: { message: Message }) => (
  <>{message.code && <><span className="msg-code">{message.code}</span>{' '}</>}{message.text}</>
);

// The corner triangle on a row that is itself a message (no result rows to put a marker on).
export const NoteCorner = ({ type }: { type: MessageType }) => (
  <span className={`note-corner note-corner--${type.toLowerCase()}`} aria-hidden="true" />
);

export function NoteRow({ messages }: { messages: Message[] }) {
  return (
    <div className={`result-row-note result-row-note--${worstType(messages).toLowerCase()}`}>
      {messages.map((m, i) => (
        <div key={i} className="note-line"><NoteText message={m} /></div>
      ))}
    </div>
  );
}

export interface NoteCounts { warn: number; info: number; notMapped: number }

export const plural = (n: number, word: string) => `${n.toLocaleString()} ${word}${n === 1 ? '' : 's'}`;

export function NotesBar({ counts, showAll, onToggle }: {
  counts: NoteCounts; showAll: boolean; onToggle: () => void;
}) {
  const parts = [
    counts.warn > 0 && <span key="w" className="notes-count"><span className="note-swatch note-swatch--warn" />{plural(counts.warn, 'warning')}</span>,
    counts.info > 0 && <span key="i" className="notes-count"><span className="note-swatch note-swatch--info" />{plural(counts.info, 'note')}</span>,
    counts.notMapped > 0 && <span key="n" className="notes-count"><span className="note-swatch note-swatch--error" />{counts.notMapped.toLocaleString()} not mapped</span>,
  ].filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <div className="notes-bar">
      {parts}
      <span className="notes-scope">on this page</span>
      {counts.warn + counts.info > 0 && (
        <button className="btn btn-secondary btn-sm" onClick={onToggle} aria-pressed={showAll}>
          {showAll ? 'Hide all notes' : 'Show all notes'}
        </button>
      )}
    </div>
  );
}
