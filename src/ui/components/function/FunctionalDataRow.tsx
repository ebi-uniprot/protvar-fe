import { TOTAL_COLS } from '../../../constants/SearchResultTable';
import ProteinFunctionTable from './ProteinFunctionTable';
import GeneAndTranslatedSequenceTable from './GeneAndTranslatedSequenceTable';
import ProteinInformationTable from './ProteinInformationTable';
import ResidueRegionTable from './ResidueRegionTable';
import ProteinIcon from '../../../images/proteins.svg';
import {FunctionalInfo} from "../../../types/FunctionalInfo";
import React from "react";
import {FunctionalDetailProps} from "./FunctionalDetail";
import {HelpContent} from "../help/HelpContent";
import {HelpButton} from "../help/HelpButton";
import {ShareAnnotationIcon} from "../common/ShareLink";
import Spaces from "../../elements/Spaces";
import {Comment, CommentType} from "../../../types/Comment";

interface FunctionalDataRowProps extends FunctionalDetailProps {
  functionalData: FunctionalInfo
}

function FunctionalDataRow(props: FunctionalDataRowProps) {
  const { functionalData, ensg, ensp } = props;

  const grouped = new Map<string, Array<Comment>>();
  functionalData.comments?.forEach((comment) => {
    if (!grouped.has(comment.type)) {
      grouped.set(comment.type, []);
    }
    grouped.get(comment.type)!.push(comment);
  });

  return (
    <tr>
      <td colSpan={TOTAL_COLS} className="expanded-row">
        <div className="significances-groups">
          <div className="column">
            <h5 style={{display: "inline"}}>
              <img src={ProteinIcon} className="click-icon" alt="protein icon"
                   title="Functional information"/> Functional information
            </h5>
            <HelpButton title="" content={<HelpContent name="function-annotations" />} />
            <Spaces count={2} />
            <ShareAnnotationIcon annotation={props.annotation} />
            <ResidueRegionTable {...props} />
            <ProteinFunctionTable functionComments={grouped.get(CommentType.FUNCTION) ?? []}/>
            <ProteinInformationTable apiData={functionalData} groupedComments={grouped}/>
            <GeneAndTranslatedSequenceTable ensg={ensg} ensp={ensp} />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default FunctionalDataRow;
