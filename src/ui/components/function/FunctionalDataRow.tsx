import { TOTAL_COLS } from '../../../constants/SearchResultTable';
import ProteinFunctionTable from './ProteinFunctionTable';
import GeneAndTranslatedSequenceTable from './GeneAndTranslatedSequenceTable';
import ProteinInformationTable from './ProteinInformationTable';
import ResidueRegionTable from './ResidueRegionTable';
import ProteinIcon from '../../../images/proteins.svg';
import {FunctionalResponse} from "../../../types/FunctionalResponse";
import React from "react";
import {FunctionalDetailProps} from "./FunctionalDetail";
import {HelpContent} from "../help/HelpContent";
import {HelpButton} from "../help/HelpButton";
import {ShareAnnotationIcon} from "../common/ShareLink";
import Spaces from "../../elements/Spaces";

interface FunctionalDataRowProps extends FunctionalDetailProps {
  functionalData: FunctionalResponse
}

function FunctionalDataRow(props: FunctionalDataRowProps) {
  const { functionalData, ensg, ensp } = props;

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
            <ProteinFunctionTable comments={functionalData.comments}/>
            <ProteinInformationTable apiData={functionalData}/>
            <GeneAndTranslatedSequenceTable ensg={ensg} ensp={ensp} />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default FunctionalDataRow;
