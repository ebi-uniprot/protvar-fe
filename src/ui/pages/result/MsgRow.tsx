import React from 'react';
import { VariantInput, Message, GenomicVariant } from "../../../types/MappingResponse";
import { NoteCorner, NoteText } from "./RowNotes";
import Tool from "../../elements/Tooltip";
import { getIdUrl, getIdValue } from "./PrimaryRow";
import { getEnsemblViewUrl } from "../../../constants/ExternalUrls";
import { TextLink } from "../../components/common/Link";

interface MsgRowProps {
  message: Message;
  input?: VariantInput;
  genomicVariant?: GenomicVariant;
  index?: number;
  showId?: boolean;    // the table has an ID column
}

const MsgRow = ({ message, input, genomicVariant, index, showId = true }: MsgRowProps) => {
  const inputStr = input?.inputStr ?? '';
  const idValue = getIdValue(input);
  // tinted by severity, so no zebra striping
  const rowClass = `result-row-msg result-row-msg--${message.type.toLowerCase()}`;

  if (genomicVariant) {
    const genomicPos = `${genomicVariant.chromosome}-${genomicVariant.position}-${genomicVariant.refBase}-${genomicVariant.altBase}`;
    return (
      <div className={`result-row ${rowClass}`}>
        <NoteCorner type={message.type} />
        {/* user-id, when the table has that column */}
        {showId && <span>
          {idValue && (
            <Tool tip="Variant ID provided by the user">
              <TextLink url={getIdUrl(idValue)} text={idValue} />
            </Tool>
          )}
        </span>}
        {/* genomic-pos */}
        <span>
          <Tool tip="Genomic coordinate — click to view the region in Ensembl" pos="up-left">
            <TextLink url={getEnsemblViewUrl(genomicVariant.chromosome, genomicVariant.position)} text={genomicPos} />
          </Tool>
        </span>
        {/* message spanning the remaining columns */}
        <span style={{ gridColumn: `${showId ? 3 : 2} / -1` }}>
          <b>{inputStr}</b> <NoteText message={message} />
        </span>
      </div>
    );
  }

  return (
    <div className={rowClass}>
      <NoteCorner type={message.type} />
      <span style={{ gridColumn: '1 / -1', wordBreak: 'break-word' }}>
        <b>{inputStr}</b> <NoteText message={message} />
      </span>
    </div>
  );
};

export default MsgRow;
