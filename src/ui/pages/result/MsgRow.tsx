import React from 'react';
import { VariantInput, Message, GenomicVariant } from "../../../types/MappingResponse";
import Tool from "../../elements/Tool";
import { getEnsemblViewUrl, getIdUrl, getIdValue } from "./PrimaryRow";
import { TextLink } from "../../components/common/Link";

export const WARN_ICON  = <><i className="msg-warn bi bi-exclamation-triangle-fill"></i>{' '}</>;
export const ERROR_ICON = <><i className="msg-error bi bi-x-circle-fill"></i>{' '}</>;
export const INFO_ICON  = <><i className="msg-info bi bi-info-circle-fill"></i>{' '}</>;

const getIcon = (m?: Message) => {
  if (m) {
    if (m.type === "ERROR") return ERROR_ICON;
    if (m.type === "WARN")  return WARN_ICON;
    if (m.type === "INFO")  return INFO_ICON;
  }
};

interface MsgRowProps {
  message: Message;
  input?: VariantInput;
  genomicVariant?: GenomicVariant;
  index?: number;
}

const MsgRow = ({ message, input, genomicVariant, index }: MsgRowProps) => {
  const inputStr = input?.inputStr ?? '';
  const idValue = getIdValue(input);
  const rowClass = `result-row-msg ${(index ?? -1) % 2 === 0 ? 'row-even' : 'row-odd'}`;

  if (genomicVariant) {
    const genomicPos = `${genomicVariant.chromosome}-${genomicVariant.position}-${genomicVariant.refBase}-${genomicVariant.altBase}`;
    return (
      <div className={`result-row ${rowClass}`}>
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
          <Tool tip="Click to see region detail from Ensembl" pos="up-left">
            <TextLink url={getEnsemblViewUrl(genomicVariant.chromosome, genomicVariant.position)} text={genomicPos} />
          </Tool>
        </span>
        {/* cols 3–11: message spanning remaining */}
        <span style={{ gridColumn: '3 / -1' }}>
          {getIcon(message)}<b>{inputStr}</b> {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={rowClass}>
      <span style={{ gridColumn: '1 / -1', padding: '4px 8px', wordBreak: 'break-word' }}>
        {getIcon(message)}<b>{inputStr}</b> {message.text}
      </span>
    </div>
  );
};

export default MsgRow;
