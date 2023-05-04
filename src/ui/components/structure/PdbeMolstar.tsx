import StructureIcon from '../../../images/structures-3d.svg';
import "./PdbeMolstar.css";
import "pdbe-molstar/build/pdbe-molstar-component-3.1.0";
import "pdbe-molstar/build/pdbe-molstar-light-3.1.0.css";
import Loader from "../../elements/Loader";
import {ProteinStructureElement} from "../../../types/ProteinStructureResponse";
import {AlphafoldResponseElement} from "../../../types/AlphafoldResponse";
import {P2PInteraction} from "../../../types/FunctionalResponse";
import {API_URL} from "../../../constants/const";

interface PdbeMolstarProps {
    selected: ProteinStructureElement|AlphafoldResponseElement|P2PInteraction
    pdbeRef: any
}

const PdbeMolstar = (props: PdbeMolstarProps) => {
    let pdbeComponent = <Loader />

    if ("pdb_id" in props.selected) {
        pdbeComponent = <pdbe-molstar id="pdbeMolstarComponent" ref={props.pdbeRef}
                                      bg-color-r="255" bg-color-g="255" bg-color-b="255" hide-controls="true"
                                      molecule-id={props.selected.pdb_id} alphafold-view="false" />
    } else if ("cifUrl" in props.selected) {
        pdbeComponent = <pdbe-molstar id="pdbeMolstarComponent" ref={props.pdbeRef}
                                      bg-color-r="255" bg-color-g="255" bg-color-b="255" hide-controls="true"
                                      custom-data-url={props.selected.cifUrl} custom-data-format="cif"
                                      alphafold-view="true"/>
        selectedAlphafoldData = props.selected
    } else if ("a" in props.selected && "b" in props.selected) {
        const modelUrl = API_URL + '/interaction/'+props.selected.a+'/'+props.selected.b+'/model';
        pdbeComponent = <pdbe-molstar id="pdbeMolstarComponent" ref={props.pdbeRef}
                                      bg-color-r="255" bg-color-g="255" bg-color-b="255" hide-controls="true"
                                      custom-data-url={modelUrl} custom-data-format="pdb" alphafold-view="false" />
    }

    return <PageSpecificStructure component={pdbeComponent} />
}

interface PageSpecificStructureProps {
    component: JSX.Element
 }

const PageSpecificStructure = (props: PageSpecificStructureProps) => {
    return (
        <td colSpan={10} className="expanded-row">
            <div className="significances-groups">
                <div className="column">
                    <h5><img src={StructureIcon} className="click-icon" alt="structure icon" title="3D structure" /> Structures</h5>
                    Image zoomed to show variant location in green<br/>
                    Reference amino acid shown
                    {props.component}
                    Click variant to see surrounding residues<br/>
                    Click white space to zoom out to whole structure
                </div>
            </div>
        </td>
    );
}

export default PdbeMolstar;