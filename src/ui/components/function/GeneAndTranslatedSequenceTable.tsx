import { ENSEMBL_GENE_RUL } from "../../../constants/ExternalUrls";
import { v1 as uuidv1 } from 'uuid';
import { TranslatedSequence } from "../mapping/Convertor";

interface GeneAndTranslatedSequenceTableProps {
ensg: string
ensp: Array<TranslatedSequence>
}
function GeneAndTranslatedSequenceTable(props: GeneAndTranslatedSequenceTableProps) {
  const {ensg, ensp} = props;
  const ensgUrl = ENSEMBL_GENE_RUL + ensg;
  var translatedSequences: Array<JSX.Element> = [];
  ensp.forEach((ensps) => {
    var enspsUrl = ENSEMBL_GENE_RUL + ensps.ensp;
    translatedSequences.push(
      <li key={uuidv1()}>
        <a href={enspsUrl} target="_blank" rel="noreferrer">
          {ensps.ensp} - {ensps.ensts}
        </a>
      </li>
    );
  });
  return <table>
    <tbody>
      <tr>
        <th>Gene</th>
        <th>Translated Sequences</th>
      </tr>
      <tr>
        <td>
          <a href={ensgUrl} target="_blank" rel="noreferrer">
            {ensg}
          </a>
        </td>
        <td>
          <ul>{translatedSequences}</ul>
        </td>
      </tr>
    </tbody>
  </table>
}
export default GeneAndTranslatedSequenceTable;