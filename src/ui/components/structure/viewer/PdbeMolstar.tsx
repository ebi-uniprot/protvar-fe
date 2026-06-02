import React from "react";
import "pdbe-molstar/build/pdbe-molstar-component";
import "pdbe-molstar/build/pdbe-molstar-light.css";
import Loader from "../../../elements/Loader";
import {PdbeStructure} from "../../../../types/PdbeStructure";
import {API_URL} from "../../../../constants/const";
import {PredictedStructure} from "../StructureData";
import {Interaction} from "../../../../types/Prediction";
import {ViewerControls} from "./ViewerControls";

interface PdbeMolstarProps {
  selected: PdbeStructure | PredictedStructure | Interaction;
  pdbeRef: any;
  controlActions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'reset';
  }>;
}

const PdbeMolstar = ({ selected, pdbeRef, controlActions = [] }: PdbeMolstarProps) => {
  let pdbeComponent = <Loader />;

  if ("pdbId" in selected) {
    pdbeComponent = (
      <pdbe-molstar
        id="pdbeMolstarComponent"
        ref={pdbeRef}
        bg-color-r="255"
        bg-color-g="255"
        bg-color-b="255"
        hide-controls="true"
        molecule-id={selected.pdbId}
        alphafold-view="true"
        hide-water="true"
        sequence-panel="true"
      />
    );
  } else if ("cifUrl" in selected) {
    pdbeComponent = (
      <pdbe-molstar
        id="pdbeMolstarComponent"
        ref={pdbeRef}
        bg-color-r="255"
        bg-color-g="255"
        bg-color-b="255"
        hide-controls="true"
        custom-data-url={selected.cifUrl}
        custom-data-format="cif"
        alphafold-view="true"
        hide-water="true"
        sequence-panel="true"
      />
    );
  } else if ("a" in selected && "b" in selected) {
    const modelUrl = `${API_URL}/prediction/interaction/${selected.a}/${selected.b}/model`;
    pdbeComponent = (
      <pdbe-molstar
        id="pdbeMolstarComponent"
        ref={pdbeRef}
        bg-color-r="255"
        bg-color-g="255"
        bg-color-b="255"
        hide-controls="true"
        custom-data-url={modelUrl}
        custom-data-format="pdb"
        alphafold-view="true"
        hide-water="true"
        sequence-panel="true"
      />
    );
  }

  return (
    <div className="structure-viewer-wrapper">
      {pdbeComponent}
      <div className="viewer-instructions">
        Click variant to see surrounding residues · Click white space to zoom out
      </div>
      <div className="viewer-controls-bar">
        <ViewerControls actions={controlActions} />
      </div>
    </div>
  );
};

export default PdbeMolstar;