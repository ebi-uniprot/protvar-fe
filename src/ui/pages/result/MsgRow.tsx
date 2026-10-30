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
}

const MsgRow = ({ message, input, genomicVariant, index }: MsgRowProps) => {
  const inputStr = input?.inputStr ?? '';
  const idValue = getIdValue(input);
  // tinted by severity, so no zebra striping
  const rowClass = `result-row-msg result-row-msg--${message.type.toLowerCase()}`;

  if (genomicVariant) {
    const genomicPos = `${genomicVariant.chromosome}-${genomicVariant.position}-${genomicVariant.refBase}-${genomicVariant.altBase}`;
    return (
      <div className={`result-row ${rowClass}`}>
        <NoteCorner type={message.type} />
        {/* col 1: user-id */}
        <span>
          {idValue && (
            <Tool tip="Variant ID provided by the user">
              <TextLink url={getIdUrl(idValue)} text={idValue} />
            </Tool>
          )}
        </span>
        {/* col 2: genomic-pos */}
        <span>
          <Tool tip="Genomic coordinate — click to view the region in Ensembl" pos="up-left">
            <TextLink url={getEnsemblViewUrl(genomicVariant.chromosome, genomicVariant.position)} text={genomicPos} />
          </Tool>
        </span>
        {/* cols 3–11: message spanning remaining */}
        <span style={{ gridColumn: '3 / -1' }}>
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
