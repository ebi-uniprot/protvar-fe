import { Pangolin } from "../../../types/MappingResponse";
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
import {NoAnnotationData} from "../common/NoAnnotationData";
import {Comment} from "../../../types/Comment";
import { Icon } from '../../elements/Icon';

export interface FunctionalDataProps {
  annotation: string
  referenceFunctionUri: string
  referencePredictionUri?: string
  refAA: string
  variantAA: string
  ensg: string
  ensp: Array<TranslatedSequence>
  caddScore: string
  aviScore?: string
  pangolin?: Pangolin
  amScore: AmScore
}

function FunctionalData(props: FunctionalDataProps) {
  const { referenceFunctionUri, referencePredictionUri, ensg, ensp } = props;
  const [apiData, setApiData] = useState<FunctionalInfo>();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['pockets-0', 'interfaces-0']));  // pockets + interfaces open by default
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
    getFunctionalData(referenceFunctionUri, referencePredictionUri).then(response => {
      setApiData(response.data);
    });
  }, [referenceFunctionUri, referencePredictionUri]);

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
    return <NoAnnotationData message="No functional data available for this residue" />;

  return (
    <div className="annotation-data-container">
      {/* Rich data: kept for now (the panel's heading is gone; the tab names the panel) */}
      <div className="annotation-intro">
        <span className="annotation-desc">Residue annotations and protein features</span>
        {dataRichness > 0.7 && (
          <span className="data-richness-badge" title={`Data richness: ${(dataRichness * 100).toFixed(0)}%`}><Icon name="check-circle-fill" /> Rich data</span>
        )}
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
            aviScore={props.aviScore}
            pangolin={props.pangolin}
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
