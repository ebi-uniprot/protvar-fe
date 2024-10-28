import {ALLELE, TOTAL_COLS} from "../../../constants/SearchResultTable";
import {
  ERROR,
  INFO,
  CustomInput,
  Message,
  WARN,
  GenomicInput,
  INPUT_PRO,
  INPUT_CDNA, INPUT_ID
} from "../../../types/MappingResponse";
import {rowBg} from "./ResultTable";
import Tool from "../../elements/Tool";
import {getEnsemblChrUrl, getEnsemblViewUrl, getIdUrl} from "./PrimaryRow";

export const WARN_ICON = <><i className="msg-warn bi bi-exclamation-triangle-fill"></i>{' '}</>
export const ERROR_ICON = <><i className="msg-error bi bi-x-circle-fill"></i>{' '}</>
export const INFO_ICON = <><i className="msg-info bi bi-info-circle-fill"></i>{' '}</>

const getIcon = (m?: Message) => {
  if (m) {
    if (m.type === ERROR)
      return ERROR_ICON
    else if (m.type === WARN)
      return WARN_ICON
    else if (m.type === INFO)
      return INFO_ICON
  }
}

interface MsgRowProps {
  message: Message,
  originalInput?: CustomInput
  derivedGenomicInput?: GenomicInput // null for request-level messages
  index?: number     // null for request-level messages
}

const MsgRow = ({
                  derivedGenomicInput,
                  originalInput,
                  message,
                  index,
                }: MsgRowProps) => {
  // IDInput: id
  // ProteinInput: acc,pos
  // CodingInput: gene,derivedUniprotAcc,derivedProtPos

  // if derived genomic input, and chr or pos determined
  const isDerivedGenomicInput = derivedGenomicInput && originalInput &&
    (originalInput.type === INPUT_PRO || originalInput.type === INPUT_CDNA || originalInput.type === INPUT_ID) &&
    (derivedGenomicInput.chr || derivedGenomicInput.pos);

  const inputStr = originalInput?.inputStr ?? '';
  const rowTitle = originalInput ? `Input: ${inputStr}` : '';
  const rowStyle = {wordWrap: "break-word", overflowWrap: "break-word"} as React.CSSProperties;

  return (
    <tr style={rowBg(index ?? -1)} title={rowTitle}>
      {isDerivedGenomicInput ?
        (
          <>
            <td>
              <Tool tip="Click to see the a summary for this chromosome from Ensembl" pos="up-left">
                <a href={getEnsemblChrUrl(derivedGenomicInput.chr)} target="_blank" rel="noopener noreferrer">
                  {derivedGenomicInput.chr}
                </a>
              </Tool>
            </td>
            <td>
              <Tool tip="Click to see the region detail for this genomic coordinate from Ensembl" pos="up-left">
                <a href={getEnsemblViewUrl(derivedGenomicInput.chr, derivedGenomicInput.pos)} target="_blank"
                   rel="noopener noreferrer">
                  {derivedGenomicInput.pos}
                </a>
              </Tool>
            </td>
            <td><Tool tip="Variant ID provided by the user">
              <a href={getIdUrl(derivedGenomicInput.id)} target="_blank"
                 rel="noopener noreferrer">{derivedGenomicInput.id}</a>
            </Tool></td>
            <td><Tool tip={ALLELE.get(derivedGenomicInput.ref)}>{derivedGenomicInput.ref}</Tool></td>
            <td><Tool tip={ALLELE.get(derivedGenomicInput.alt)}>{derivedGenomicInput.alt}</Tool></td>
            <td colSpan={10}>
              <div style={rowStyle}>
                {getIcon(message)}
                <b>{inputStr}</b> {message.text}
              </div>
            </td>
          </>
        ) : (
          <td colSpan={TOTAL_COLS}>
            <div style={rowStyle}>
              {getIcon(message)}
              <b>{inputStr}</b> {message.text}
            </div>
          </td>
        )
      }
    </tr>
  )
};


export default MsgRow;