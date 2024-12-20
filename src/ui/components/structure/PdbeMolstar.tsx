import "./PdbeMolstar.css";
import "pdbe-molstar/build/pdbe-molstar-component";
import "pdbe-molstar/build/pdbe-molstar-light.css";
import Loader from "../../elements/Loader";
import {ProteinStructureElement} from "../../../types/ProteinStructureResponse";
import {P2PInteraction} from "../../../types/FunctionalResponse";
import {API_URL} from "../../../constants/const";
import {PredictedStructure} from "./StructuralDetail";

interface PdbeMolstarProps {
    selected: ProteinStructureElement|PredictedStructure|P2PInteraction
    pdbeRef: any
}

const PdbeMolstar = (props: PdbeMolstarProps) => {
    let pdbeComponent = <Loader />

    if ("pdb_id" in props.selected) {
        pdbeComponent = <pdbe-molstar id="pdbeMolstarComponent" ref={props.pdbeRef}
                                      bg-color-r="255" bg-color-g="255" bg-color-b="255" hide-controls="true"
                                      molecule-id={props.selected.pdb_id} alphafold-view="true" hide-water="true" />
    } else if ("cifUrl" in props.selected) {
        pdbeComponent = <pdbe-molstar id="pdbeMolstarComponent" ref={props.pdbeRef}
                                      bg-color-r="255" bg-color-g="255" bg-color-b="255" hide-controls="true"
                                      custom-data-url={props.selected.cifUrl} custom-data-format="cif"
                                      alphafold-view="true" hide-water="true" />
    } else if ("a" in props.selected && "b" in props.selected) {
        const modelUrl = API_URL + '/interaction/'+props.selected.a+'/'+props.selected.b+'/model';
        pdbeComponent = <pdbe-molstar id="pdbeMolstarComponent" ref={props.pdbeRef}
                                      bg-color-r="255" bg-color-g="255" bg-color-b="255" hide-controls="true"
                                      custom-data-url={modelUrl} custom-data-format="pdb" alphafold-view="true" hide-water="true" />
    }

    return <>
        {pdbeComponent}
        Click variant to see surrounding residues<br/>
        Click white space to zoom out to whole structure
    </>
}

export default PdbeMolstar;