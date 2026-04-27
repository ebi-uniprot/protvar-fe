import { useState, useEffect, useMemo } from 'react';
import Loader from '../../elements/Loader';
import {getFunctionalData} from "../../../services/ProtVarService";
import {FunctionalInfo} from "../../../types/FunctionalInfo";
import {AmScore, TranslatedSequence} from "../../../types/MappingResponse";
import GeneAndTranslatedSequence from './GeneAndTranslatedSequence';
import ProteinInfoPanel from './ProteinInfoPanel';
import {ResidueColumn} from './ResidueColumn';
import {RegionColumn} from './RegionColumn';
import { filterFeaturesByPosition } from './utils/featureUtils';
import {useStructureNavigation} from "../../../hooks/useStructureNavigation";
import ProteinIcon from '../../../images/proteins.svg';
import {HelpContent} from "../help/HelpContent";
import {HelpButton} from "../help/HelpButton";
import {ShareAnnotationIcon} from "../common/ShareLink";
import {NoAnnotationData} from "../common/NoAnnotationData";
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
  const [apiData, setApiData] = useState<FunctionalInfo>();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const { openPocketInStructure, openInteractionInStructure } = useStructureNavigation();

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const calculateDataRichness = (data?: FunctionalInfo): number => {
    if (!data) return 0;
    const hasAnyPredictions = data.conservScore || props.amScore || props.caddScore
      || data.esmScore || data.popEveScore
      || (data.foldxs && data.foldxs.length > 0)
      || data.m3dPred;
    let score = 0;
    if (hasAnyPredictions) score += 0.3;
    if (data.features && data.features.length > 0) score += 0.25;
    if (data.comments && data.comments.length > 0) score += 0.25;
    if (data.pockets && data.pockets.length > 0) score += 0.1;
    if (data.interactions && data.interactions.length > 0) score += 0.1;
    return Math.min(score, 1.0);
  };

  const dataRichness = calculateDataRichness(apiData);

  useEffect(() => {
    getFunctionalData(referenceFunctionUri).then(response => {
      setApiData(response.data);
    });
  }, [referenceFunctionUri]);

  const { residues, regions } = useMemo(
    () => filterFeaturesByPosition(
      apiData?.features || [],
      apiData?.position ?? 0
    ),
    [apiData?.features, apiData?.position]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Array<Comment>>();
    apiData?.comments?.forEach(comment => {
      if (!map.has(comment.type)) map.set(comment.type, []);
      map.get(comment.type)!.push(comment);
    });
    return map;
  }, [apiData?.comments]);

  if (!apiData)
    return <div className="annotation-loader"><Loader /></div>;

  if (!apiData.entryId)
    return <NoAnnotationData icon={ProteinIcon} iconAlt="Functional information" title="Functional Information" message="No functional data available for this residue" />;

  return (
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
        <div className="functional-annotations-grid">
          <ResidueColumn
            residues={residues}
            functionalData={apiData}
            refAA={props.refAA}
            variantAA={props.variantAA}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            ensg={ensg}
            ensp={ensp}
            caddScore={props.caddScore}
            amScore={props.amScore}
          />
          <RegionColumn
            regions={regions}
            accession={apiData.accession}
            pockets={apiData.pockets}
            interactions={apiData.interactions}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onViewPocket={openPocketInStructure}
            onViewInteraction={openInteractionInStructure}
          />
        </div>
        <ProteinInfoPanel functionalData={apiData} groupedComments={grouped} />
        <GeneAndTranslatedSequence ensg={ensg} ensp={ensp} />
      </div>
    </div>
  );
}

export default FunctionalData;
