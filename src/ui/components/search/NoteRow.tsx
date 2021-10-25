import { ENSEMBL_CHRM_URL, ENSEMBL_VIEW_URL } from "../../../constants/ExternalUrls";
import { ALLELE, ANNOTATION_COLS, GENOMIC_COLS, PROTEIN_COLS } from "../../../constants/SearchResultTable";
import { MappingRecord } from "../../../utills/Convertor";
import Tool from "../../elements/Tool";

const NoteRow = (props: { record: MappingRecord }) => {
  const { record } = props;
  const positionUrl = ENSEMBL_VIEW_URL + record.chromosome + ':' + record.position + '-' + record.position;
  return <tr>
    <td>
      <Tool tip="Click to see the a summary for this chromosome from Ensembl" pos="up-left">
        <a href={ENSEMBL_CHRM_URL + record.chromosome} target="_blank" rel="noopener noreferrer">
          {record.chromosome}
        </a>
      </Tool>
    </td>
    <td>
      <Tool tip="Click to see the region detail for this genomic coordinate from Ensembl" pos="up-left">
        <a href={positionUrl} target="_blank" rel="noopener noreferrer">
          {record.position}
        </a>
      </Tool>
    </td>
    <td><Tool tip="Variant ID provided by the user">{record.id}</Tool></td>
    <td><Tool tip={ALLELE.get(record.refAllele)}>{record.refAllele}</Tool></td>
    <td><Tool tip={ALLELE.get(record.altAllele)}>{record.altAllele}</Tool></td>
    <td colSpan={GENOMIC_COLS + PROTEIN_COLS} style={{ borderRight: 0 }}>
      {record.note}
    </td>
    <td colSpan={ANNOTATION_COLS} style={{ borderLeft: 0 }}><br /><br /></td>
  </tr>
};


export default NoteRow;