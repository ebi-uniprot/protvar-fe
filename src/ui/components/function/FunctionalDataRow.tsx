import { TOTAL_COLS } from '../../../constants/SearchResultTable';
import GeneAndTranslatedSequenceTable from './GeneAndTranslatedSequenceTable';
import ProteinInfoPanel from './ProteinInfoPanel';
import FunctionalAnnotationsPanel from './FunctionalAnnotationsPanel';
import ProteinIcon from '../../../images/proteins.svg';
import {FunctionalInfo} from "../../../types/FunctionalInfo";
import React from "react";
import {FunctionalDetailProps} from "./FunctionalDetail";
import {HelpContent} from "../help/HelpContent";
import {HelpButton} from "../help/HelpButton";
import {ShareAnnotationIcon} from "../common/ShareLink";
import Spaces from "../../elements/Spaces";
import {Comment} from "../../../types/Comment";
import '../../../styles/new/annotation.css';
import '../../../styles/new/function.css';

interface FunctionalDataRowProps extends FunctionalDetailProps {
  functionalData: FunctionalInfo;
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
        <div className="annotation-data-container">
          <div className="annotation-header">
            <h5>
              <img src={ProteinIcon} className="click-icon" alt="protein icon" title="Functional information" />
              Functional Information
            </h5>
            <div className="annotation-actions">
              <HelpButton title="" content={<HelpContent name="function-annotations" />} />
              <Spaces count={2} />
              <ShareAnnotationIcon annotation={props.annotation} />
            </div>
          </div>

          <FunctionalAnnotationsPanel {...props} />
          <ProteinInfoPanel functionalData={functionalData} groupedComments={grouped} />
          <GeneAndTranslatedSequenceTable ensg={ensg} ensp={ensp} />
        </div>
      </td>
    </tr>
  );
}

export default FunctionalDataRow;