import { useState, useEffect } from 'react';
import LoaderRow from '../../pages/result/LoaderRow';
import {getFunctionalData} from "../../../services/ProtVarService";
import {FunctionalInfo} from "../../../types/FunctionalInfo";
import {AmScore, TranslatedSequence} from "../../../types/MappingResponse";
import {TOTAL_COLS} from "../../../constants/SearchResultTable";
import GeneAndTranslatedSequence from './GeneAndTranslatedSequence';
import ProteinInfoPanel from './ProteinInfoPanel';
import FunctionalAnnotations from './FunctionalAnnotations';
import ProteinIcon from '../../../images/proteins.svg';
import {HelpContent} from "../help/HelpContent";
import {HelpButton} from "../help/HelpButton";
import {ShareAnnotationIcon} from "../common/ShareLink";
import Spaces from "../../elements/Spaces";
import {Comment} from "../../../types/Comment";
import '../../../styles/new/annotation.css';
import '../../../styles/new/function.css';

export interface FunctionalDataProps {
  annotation: string
  referenceFunctionUri: string
  refAA: string
  variantAA: string
  ensg: string
  ensp: Array<TranslatedSequence>
  caddScore: string
  amScore: AmScore
}

function FunctionalData(props: FunctionalDataProps) {
  const { referenceFunctionUri, annotation, ensg, ensp } = props;
  const [apiData, setApiData] = useState<FunctionalInfo>()

  useEffect(() => {
    getFunctionalData(referenceFunctionUri).then(
      response => {
        setApiData(response.data)
      }
    )
  }, [referenceFunctionUri]);

  if (!apiData)
    return <LoaderRow />
  else if (!apiData.entryId)
    return <NoFunctionalDataRow />;

  const grouped = new Map<string, Array<Comment>>();
  apiData.comments?.forEach((comment) => {
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
              <ShareAnnotationIcon annotation={annotation} />
            </div>
          </div>

          <FunctionalAnnotations functionalData={apiData} {...props} />
          <ProteinInfoPanel functionalData={apiData} groupedComments={grouped} />
          <GeneAndTranslatedSequence ensg={ensg} ensp={ensp} />
        </div>
      </td>
    </tr>
  );
}

function NoFunctionalDataRow() {
  return <tr>
    <td colSpan={TOTAL_COLS} className="expanded-row">
      <div className="column">No functional data for this residue</div>
    </td>
  </tr>
}

export default FunctionalData;