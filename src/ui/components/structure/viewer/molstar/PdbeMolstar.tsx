import React from "react";
import "pdbe-molstar/build/pdbe-molstar-component";
import "pdbe-molstar/build/pdbe-molstar-light.css";
import Loader from "../../../../elements/Loader";
import {PdbeStructure} from "../../../../../types/PdbeStructure";
import {API_URL} from "../../../../../constants/const";
import {PredictedStructure} from "../../StructureData";
import {Interaction} from "../../../../../types/Prediction";
import {viewerBgColor} from "../../../../../types/Colors";
import {HOVER_COLOR} from "../viewerColors";

interface PdbeMolstarProps {
  selected: PdbeStructure | PredictedStructure | Interaction;
  pdbeRef: any;
  /** Colour key shown under the controls. */
  legend?: React.ReactNode;
  /** Controls shown under the viewer. */
  controls?: React.ReactNode;
  /** Floats over the 3D view (e.g. the PAE image), so it never shifts the page. */
  overlay?: React.ReactNode;
}

const PdbeMolstar = ({ selected, pdbeRef, legend, controls, overlay }: PdbeMolstarProps) => {
  const bg = viewerBgColor();
  let pdbeComponent = <Loader />;

  if ("pdbId" in selected) {
    pdbeComponent = (
      <pdbe-molstar
        id="pdbeMolstarComponent"
        ref={pdbeRef}
        bg-color-r={String(bg.r)}
        bg-color-g={String(bg.g)}
        bg-color-b={String(bg.b)}
        highlight-color-r={String(HOVER_COLOR.r)}
        highlight-color-g={String(HOVER_COLOR.g)}
        highlight-color-b={String(HOVER_COLOR.b)}
        hide-controls="true"
        molecule-id={selected.pdbId}
        alphafold-view="true"
        hide-water="true"
      />
    );
  } else if ("cifUrl" in selected) {
    pdbeComponent = (
      <pdbe-molstar
        id="pdbeMolstarComponent"
        ref={pdbeRef}
        bg-color-r={String(bg.r)}
        bg-color-g={String(bg.g)}
        bg-color-b={String(bg.b)}
        highlight-color-r={String(HOVER_COLOR.r)}
        highlight-color-g={String(HOVER_COLOR.g)}
        highlight-color-b={String(HOVER_COLOR.b)}
        hide-controls="true"
        custom-data-url={selected.cifUrl}
        custom-data-format="cif"
        alphafold-view="true"
        hide-water="true"
      />
    );
  } else if ("a" in selected && "b" in selected) {
    const modelUrl = `${API_URL}/prediction/interface/${selected.a}/${selected.b}/model`;
    pdbeComponent = (
      <pdbe-molstar
        id="pdbeMolstarComponent"
        ref={pdbeRef}
        bg-color-r={String(bg.r)}
        bg-color-g={String(bg.g)}
        bg-color-b={String(bg.b)}
        highlight-color-r={String(HOVER_COLOR.r)}
        highlight-color-g={String(HOVER_COLOR.g)}
        highlight-color-b={String(HOVER_COLOR.b)}
        hide-controls="true"
        custom-data-url={modelUrl}
        custom-data-format="pdb"
        alphafold-view="true"
        hide-water="true"
      />
    );
  }

  return (
    <div className="structure-viewer-wrapper">
      <div className="pv-viewer-stage">
        {pdbeComponent}
        {overlay}
      </div>
      {controls}
      {legend}
    </div>
  );
};

export default PdbeMolstar;