import Evidences from "../categories/Evidences";
import { Comment } from "./FunctionalDetail"

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
            <>
              <br />
              <Evidences evidences={comment.text[0].evidences} />
            </>
          );
      }
    });
  }

  return <table>
    <tbody>
      <th>protein function</th>

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