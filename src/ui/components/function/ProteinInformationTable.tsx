import LabelValueLi from "./LabelValueLi";
import ProteinInformationRegions from "./region/ProteinInformationRegions";
import {FunctionalInfo, Gene} from "../../../types/FunctionalInfo";
import {v1 as uuidv1} from "uuid";
import {Comment} from "../../../types/Comment";

interface ProteinInformationTableProps {
  apiData: FunctionalInfo
  groupedComments: Map<string, Array<Comment>>
}

function ProteinInformationTable(props: ProteinInformationTableProps) {
  const data = props.apiData;
  return <table>
    <tbody>
      <tr>
        <th>Further General Protein Information (not specific to the variant) from UniProt</th>
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
                    {displayGeneNameAndSynonym(data.gene)}
                    <LabelValueLi label="UniProtKB entry name" value={data.id} />
                    <LabelValueLi label="Protein evidence" value={data.proteinExistence} />
                    <LabelValueLi label="Entry last updated" value={data.lastUpdated} />
                    <LabelValueLi label="Sequence modified" value={data.sequence.modified} />
                    <LabelValueLi label="Sequence length" value={data.sequence.length.toString()} />
                  </ul>
                </td>
                <td className="protein-table-cell">
                  <ProteinInformationRegions groupedComments={props.groupedComments} accession={data.accession} />
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
}

function displayGeneNameAndSynonym(gene: Array<Gene>) {
  const genes: Array<JSX.Element> = [];
  if (gene && gene.length > 0) {

    gene.forEach((g) => {
      genes.push(
        <li key={uuidv1()}>
          <b>Gene Name :</b> {g.name.value}
        </li>
      );
      if (g.synonyms) {
        genes.push(
          <li key={uuidv1()}>
            <b>Synonyms: </b> {g.synonyms.map(s => s.value).join(",")}
          </li>
        );
      }
    });
  }
  return <>{genes}</>;
}
export default ProteinInformationTable;