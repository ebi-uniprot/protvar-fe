import React, {useState, useMemo} from "react";
import {FunctionalInfo} from "../../../types/FunctionalInfo";
import {AmScore, TranslatedSequence} from "../../../types/MappingResponse";
import { filterFeaturesByPosition } from './utils/featureUtils';
import {useStructureNavigation} from "../../../hooks/useStructureNavigation";
import {ResidueColumn} from "./ResidueColumn";
import {RegionColumn} from "./RegionColumn";

export interface FunctionalAnnotationsProps {
  functionalData: FunctionalInfo
  refAA: string
  variantAA: string
  ensg: string
  ensp: Array<TranslatedSequence>
  caddScore: string
  amScore: AmScore
}

function FunctionalAnnotations(props: FunctionalAnnotationsProps) {
  const [expandedSection, setExpandedSection] = useState<string>('');
  const { openPocketInStructure, openInteractionInStructure } = useStructureNavigation();

  // Toggle function - compares current state
  const toggleSection = (key: string) => {
    setExpandedSection(expandedSection === key ? '' : key);
  };

  // Filter features into residues and regions
  const { residues, regions } = useMemo(
    () => filterFeaturesByPosition(
      props.functionalData.features || [],
      props.functionalData.position
    ),
    [props.functionalData.features, props.functionalData.position]
  );

  return (
    <div className="functional-annotations-grid">
      <ResidueColumn
        residues={residues}
        functionalData={props.functionalData}
        refAA={props.refAA}
        variantAA={props.variantAA}
        expandedSection={expandedSection}
        onToggleSection={toggleSection}
        ensg={props.ensg}
        ensp={props.ensp}
        caddScore={props.caddScore}
        amScore={props.amScore}
      />

      <RegionColumn
        regions={regions}
        accession={props.functionalData.accession}
        pockets={props.functionalData.pockets}
        interactions={props.functionalData.interactions}
        expandedSection={expandedSection}
        onToggleSection={toggleSection}
        onViewPocket={openPocketInStructure}
        onViewInteraction={openInteractionInStructure}
      />
    </div>
  );
}

export default FunctionalAnnotations;