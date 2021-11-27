import { FunctionalResponse, GeneName } from "./FunctionalDetail";
import LabelValueLi from "./LabelValueLi";
import ProteinInformationRegions from "./region/ProteinInformationRegions";

interface ProteinInformationTableProps {
  apiData: FunctionalResponse
}

function ProteinInformationTable(props: ProteinInformationTableProps) {
  const data = props.apiData;
  return <table>
    <tbody>
      <tr>
        <th>Further General Protein Information (not specific to the variant)</th>
      </tr>
      <tr>
        <td>
          <table>
            <tbody>
              <tr>
                <td>
                  <ul style={{ listStyleType: 'none' }}>
                    <LabelValueLi label="Recommended name" value={data.name} />
                    <LabelValueLi label="Alternative name" value={data.alternativeNames} />
                    {displayGeneNameAndSynonym(data.geneNames)}
                    <LabelValueLi label="UniProtKB entry name" value={data.id} />
                    <LabelValueLi label="Protein evidence" value={data.proteinExistence} />
                    <LabelValueLi label="Entry last updated" value={data.lastUpdated} />
                    <LabelValueLi label="Sequence modified" value={data.sequence.modified} />
                    <LabelValueLi label="Sequence length" value={data.sequence.length.toString()} />
                  </ul>
                </td>
                <td className="protein-table-cell">
                  <ProteinInformationRegions comments={data.comments} accession={data.accession} />
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
}

function displayGeneNameAndSynonym(geneNames: Array<GeneName>) {
  const genes: Array<JSX.Element> = [];
  if (geneNames && geneNames.length > 0) {

    geneNames.forEach((geneName) => {
      genes.push(
        <li key={geneName.geneName}>
          <b>Gene Name :</b> {geneName.geneName}
        </li>
      );
      if (geneName.synonyms) {
        genes.push(
          <li key={geneName.synonyms}>
            <b>Synonyms: </b> {geneName.synonyms}
          </li>
        );
      }
    });
  }
  return <>{genes}</>;
}
export default ProteinInformationTable;