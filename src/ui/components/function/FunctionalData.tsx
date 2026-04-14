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
import {Comment} from "../../../types/Comment";



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

  // Calculate data richness (0.0 to 1.0)
  const calculateDataRichness = (data?: FunctionalInfo): number => {
    if (!data) return 0;

    const hasAnyPredictions = data.conservScore || props.amScore || props.caddScore
                                          || data.esmScore || data.popEveScore
                                          || (data.foldxs && data.foldxs.length > 0)
                                          || data.m3dPred;

    let score = 0;
    //if (data.predictions && Object.keys(data.predictions).length > 0) score += 0.3;
    if (hasAnyPredictions) score += 0.3;
    if (data.features && data.features.length > 0) score += 0.25;
    if (data.comments && data.comments.length > 0) score += 0.25;
    if (data.pockets && data.pockets.length > 0) score += 0.1;
    if (data.interactions && data.interactions.length > 0) score += 0.1;

    return Math.min(score, 1.0);
  };

  // For now, use random (will be replaced with API data later)
  //const dataRichness = apiData ? calculateDataRichness(apiData) : Math.random();
  const dataRichness = calculateDataRichness(apiData);

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
            <div className="annotation-title">
              <img
                src={ProteinIcon}
                className="annotation-icon"
                data-fill={dataRichness.toFixed(1)}
                alt="Functional information"
                title={`Data richness: ${(dataRichness * 100).toFixed(0)}%`}
              />
              <h5>Functional Information</h5>
              {dataRichness > 0.7 && (
                <span className="data-richness-badge">
                    <i className="bi bi-check-circle-fill"></i>
                    Rich data
                  </span>
              )}
            </div>
            <div className="annotation-actions">
              <HelpButton title="" content={<HelpContent name="function-annotations" />} />
              <ShareAnnotationIcon annotation={annotation} />
            </div>
          </div>
          <div className="annotation-content">
            <FunctionalAnnotations functionalData={apiData} {...props} />
            <ProteinInfoPanel functionalData={apiData} groupedComments={grouped} />
            <GeneAndTranslatedSequence ensg={ensg} ensp={ensp} />
          </div>
        </div>
      </td>
    </tr>
  );
}

function NoFunctionalDataRow() {
  return (
    <tr>
      <td colSpan={TOTAL_COLS} className="expanded-row">
        <div className="annotation-data-container">
          <div className="annotation-header">
            <div className="annotation-title">
              <img
                src={ProteinIcon}
                className="annotation-icon"
                data-fill="0.0"
                alt="Functional information"
              />
              <h5>Functional Information</h5>
            </div>
          </div>
          <div className="no-data-message">
            No functional data available for this residue
          </div>
        </div>
      </td>
    </tr>
  );
}

export default FunctionalData;