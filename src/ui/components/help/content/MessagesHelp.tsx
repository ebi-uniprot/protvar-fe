import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HELP } from '../../../../constants/BrowserPaths'
import { getMessageCatalogue } from '../../../../services/ProtVarService'
import { MessageCatalogueEntry } from '../../../../types/PagedMappingResponse'

// code ranges of the catalogue (first digit of the PV number)
const GROUPS: Record<string, string> = {
  '1': 'Protein input',
  '2': 'Genomic input',
  '3': 'HGVS and RefSeq',
  '4': 'Variant IDs (dbSNP, ClinVar, COSMIC)',
  '5': 'Genome assembly',
  '8': 'Request',
  '9': 'Input lines',
}

const SEVERITY: Record<MessageCatalogueEntry['type'], string> = { ERROR: 'Not mapped', WARN: 'Warning', INFO: 'Note' }

// message texts carry placeholders (%s, %1$s, %d) filled in per input
const readable = (text: string) => text.replace(/%(\d\$)?[sd]/g, '…').replace(/%%/g, '%')

export const MessagesHelp = () => {
  const [entries, setEntries] = useState<MessageCatalogueEntry[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    getMessageCatalogue().then(r => setEntries(r.data)).catch(() => setFailed(true))
  }, [])

  const groups = Object.entries(GROUPS)
    .map(([digit, title]) => ({ title, items: (entries ?? []).filter(e => e.code.startsWith(`PV-${digit}`)) }))
    .filter(g => g.items.length)

  return (
    <div className="help-content">
      <h1 id="messages">Messages and notes</h1>

      <p>
        ProtVar tells you what it did with each input line. Each message has a code (e.g. <code>PV-201</code>)
        that you can quote when contacting us.
      </p>
      <ul>
        <li><strong>Not mapped</strong> (red) — the line gave no result, for example an unsupported format or a
          position outside the coding sequence. The line is shown as a message row.</li>
        <li><strong>Warning</strong> (amber) — the line was mapped, but ProtVar changed or completed something,
          e.g. it used UniProt's reference residue, or showed every change because no alternative was given.</li>
        <li><strong>Note</strong> (blue) — information only, e.g. the detected genome assembly.</li>
      </ul>
      <p>
        On the <Link to={`${HELP}#results`}>result page</Link>, a coloured corner on a row marks a line with a
        note: hover it to read the note, or click to open it under the row. For an upload, the summary above the
        table counts the lines that could not be mapped and the lines with notes; click a count to show those
        lines. The <strong>Notes</strong> section of the filters finds lines with or without notes, or with a
        particular code (see <Link to={`${HELP}#browse:filtering-your-uploads`}>Filtering your uploads</Link>).
        Downloads include each line's notes in the Notes column.
      </p>

      <h2 id="messages:codes">Codes</h2>
      {failed && <p>The list of codes could not be loaded. Please try again later.</p>}
      {!entries && !failed && <p>Loading…</p>}
      {groups.map(g => (
        <React.Fragment key={g.title}>
          <h3>{g.title}</h3>
          <table>
            <thead><tr><th>Code</th><th>Type</th><th>Message</th></tr></thead>
            <tbody>
              {g.items.map(e => (
                <tr key={e.code} id={`messages:${e.code}`}>
                  <td><code>{e.code}</code></td>
                  <td>{SEVERITY[e.type]}</td>
                  <td><strong>{e.label}.</strong> {readable(e.text)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      ))}
    </div>
  )
}
