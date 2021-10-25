import { ANNOTATION_COLS, GENOMIC_COLS, PROTEIN_COLS } from '../../../constants/SearchResultTable';
import { ParsedInput } from '../../../types/MappingResponse';

interface InvalidTableRowsProps {
  invalidInputs: Array<ParsedInput>
}
const InvalidTableRows = (props: InvalidTableRowsProps) => {
  const invalidRows = props.invalidInputs.map(input => invalidRow(input))
  return <>{invalidRows}</>
};

function invalidRow(invalidInput: ParsedInput) {
  return <tr key={invalidInput.inputString}>
    <td>{invalidInput.chromosome}</td>
    <td>{invalidInput.start}</td>
    <td>{invalidInput.id}</td>
    <td>{invalidInput.ref}</td>
    <td>{invalidInput.alt}</td>
    <td colSpan={GENOMIC_COLS}>Input: {invalidInput.inputString}</td>
    <td colSpan={PROTEIN_COLS} style={{ borderRight: 0 }}>Message: {invalidInput.invalidReason}</td>
    <td colSpan={ANNOTATION_COLS} style={{ borderLeft: 0 }}><br /><br /></td>
  </tr>
}

export default InvalidTableRows;