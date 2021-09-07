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
        <th>Further protein information</th>
      </tr>
      <tr>
        <td>
          <table>
            <tbody>
              <tr>
                <td>
                  <ul style={{ listStyleType: 'none' }}>
                    <LabelValueLi label="Recommended Name" value={data.name} />
                    <LabelValueLi label="Alternative Name" value={data.alternativeNames} />
                    {displayGeneNameAndSynonym(data.geneNames)}
                    <LabelValueLi label="Id" value={data.id} />
                    <LabelValueLi label="Protein Existence" value={data.proteinExistence} />
                    <LabelValueLi label="Entry last updated" value={data.lastUpdated} />
                    <LabelValueLi label="Sequence Modified" value={data.sequence.modified} />
                    <LabelValueLi label="Sequence Length" value={data.sequence.length.toString()} />
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