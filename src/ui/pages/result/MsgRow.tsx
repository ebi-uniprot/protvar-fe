import {ALLELE, TOTAL_COLS} from "../../../constants/SearchResultTable";
import {
  UserInput,
  Message,
  GenomicVariant
} from "../../../types/MappingResponse";
import {rowBg} from "./ResultTable";
import Tool from "../../elements/Tool";
import {getEnsemblChrUrl, getEnsemblViewUrl, getIdUrl, getIdValue} from "./PrimaryRow";

export const WARN_ICON = <><i className="msg-warn bi bi-exclamation-triangle-fill"></i>{' '}</>
export const ERROR_ICON = <><i className="msg-error bi bi-x-circle-fill"></i>{' '}</>
export const INFO_ICON = <><i className="msg-info bi bi-info-circle-fill"></i>{' '}</>

const getIcon = (m?: Message) => {
  if (m) {
    if (m.type === "ERROR")
      return ERROR_ICON
    else if (m.type === "WARN")
      return WARN_ICON
    else if (m.type === "INFO")
      return INFO_ICON
  }
}

interface MsgRowProps {
  message: Message,
  userInput?: UserInput
  genomicVariant?: GenomicVariant // null for request-level messages
  index?: number     // null for request-level messages
}

const MsgRow = ({
                  message,
                  userInput,
                  genomicVariant,
                  index
                }: MsgRowProps) => {
  // IDInput: id
  // ProteinInput: acc,pos
  // CodingInput: gene,derivedUniprotAcc,derivedProtPos

  // if derived genomic input, and chr or pos determined
  //const isDerivedGenomicInput = derivedGenomicInput && userInput &&
    //(userInput.type === INPUT_PRO || userInput.type === INPUT_CDNA || userInput.type === INPUT_ID) &&
  //  (derivedGenomicInput.chr || derivedGenomicInput.pos);

  const inputStr = userInput?.inputStr ?? '';
  const rowTitle = userInput ? `Input: ${inputStr}` : '';
  const rowStyle = {wordWrap: "break-word", overflowWrap: "break-word"} as React.CSSProperties;

  const idValue = getIdValue(userInput);

  return (
    <tr style={rowBg(index ?? -1)} title={rowTitle}>
      {genomicVariant ?
        (
          <>
            <td>
              <Tool tip="Click to see the a summary for this chromosome from Ensembl" pos="up-left">
                <a href={getEnsemblChrUrl(genomicVariant.chr)} target="_blank" rel="noopener noreferrer">
                  {genomicVariant.chr}
                </a>
              </Tool>
            </td>
            <td>
              <Tool tip="Click to see the region detail for this genomic coordinate from Ensembl" pos="up-left">
                <a href={getEnsemblViewUrl(genomicVariant.chr, genomicVariant.pos)} target="_blank"
                   rel="noopener noreferrer">
                  {genomicVariant.pos}
                </a>
              </Tool>
            </td>
            <td><Tool tip="Variant ID provided by the user">
              { idValue && <a href={getIdUrl(idValue)} target="_blank" rel="noopener noreferrer">
                {idValue}
              </a>
              }
            </Tool></td>
            <td><Tool tip={ALLELE.get(genomicVariant.ref)}>{genomicVariant.ref}</Tool></td>
            <td><Tool tip={ALLELE.get(genomicVariant.alt)}>{genomicVariant.alt}</Tool></td>
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