import { Fragment } from "react"
import Evidences from "./Evidences";
import {Comment} from "../../../types/FunctionalResponse";
import { v1 as uuidv1 } from 'uuid';

interface ProteinFunctionTableProps {
  comments: Array<Comment>
}
function ProteinFunctionTable(props: ProteinFunctionTableProps) {
  var functionText = '';
  var functionEvidences: Array<JSX.Element> = [];

  if (props.comments) {
    props.comments.forEach((comment) => {
      if (comment.type === 'FUNCTION' && comment.text.length > 0) {
        functionText = comment.text[0].value;
        if (comment.text[0].evidences)
          functionEvidences.push(
            <Fragment key={uuidv1()}>
              <br />
              <Evidences evidences={comment.text[0].evidences} />
            </Fragment>
          );
      }
    });
  }

  return <table>
    <thead>
      <tr>
        <th>General Protein Function (not specific to the variant) from UniProt</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          {functionText}
          {functionEvidences}
        </td>
      </tr>
    </tbody>
  </table>
}
export default ProteinFunctionTable;