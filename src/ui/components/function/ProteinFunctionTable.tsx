import Evidences from "./Evidences";
import {Comment} from "../../../types/Comment";
import {Evidence} from "../../../types/Common";
import {v1 as uuidv1} from "uuid";
import {ExpandableText} from "../common/ExpandableText";

interface ProteinFunctionTableProps {
  functionComments: Array<Comment>
}
function ProteinFunctionTable(props: ProteinFunctionTableProps) {
  if (!props.functionComments)
    return null;

  return <table>
    <thead>
      <tr>
        <th>General Protein Function (not specific to the variant) from UniProt</th>
      </tr>
    </thead>
    <tbody>
    {props.functionComments.map(comment => {
      let functionText = ''
      let evidences: Evidence[] = []
      if ('text' in comment && Array.isArray(comment.text)) {
        functionText = comment.text[0].value;
        evidences = comment.text[0].evidences ?? [];
      }
      return <tr key={uuidv1()}>
        <td>
          <ExpandableText text={functionText} />
          {evidences.length > 0 && (
            <>
              <br/>
              <Evidences evidences={evidences}/>
            </>
          )}
        </td>

      </tr>
    })}
    </tbody>
  </table>
}

export default ProteinFunctionTable;