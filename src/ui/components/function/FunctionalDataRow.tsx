import { TOTAL_COLS } from '../../../constants/SearchResultTable';
import ProteinFunctionTable from './ProteinFunctionTable';
import GeneAndTranslatedSequenceTable from './GeneAndTranslatedSequenceTable';
import ProteinInformationTable from './ProteinInformationTable';
import ResidueRegionTable from './ResidueRegionTable';
import ProteinIcon from '../../../images/proteins.svg';
import {FunctionalResponse} from "../../../types/FunctionalResponse";
import React from "react";
import {FunctionalDetailProps} from "./FunctionalDetail";
import ShareAnnotation from "../common/ShareAnnotation";

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
            <h5><img src={ProteinIcon} className="click-icon" alt="protein icon"
                     title="Functional information"/> Functional information
              <ShareAnnotation annotation={props.annotation} />
            </h5>
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
