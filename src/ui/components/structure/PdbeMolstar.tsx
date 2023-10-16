import StructureIcon from '../../../images/structures-3d.svg';
import "./PdbeMolstar.css";
import "pdbe-molstar/build/pdbe-molstar-component-3.1.2";
import "pdbe-molstar/build/pdbe-molstar-light-3.1.2.css";
import Loader from "../../elements/Loader";
import {ProteinStructureElement} from "../../../types/ProteinStructureResponse";
import {AlphafoldResponseElement} from "../../../types/AlphafoldResponse";
import {P2PInteraction} from "../../../types/FunctionalResponse";
import {API_URL} from "../../../constants/const";
import {useEffect, useState} from "react";
import {PAE} from "./AlphafoldInfoTable";

interface PdbeMolstarProps {
    selected: ProteinStructureElement|AlphafoldResponseElement|P2PInteraction
    pdbeRef: any
}

const PdbeMolstar = (props: PdbeMolstarProps) => {
    const [pae, setPae] = useState(<></>);
    useEffect(() => {
        setPae(props.selected && "paeImageUrl" in props.selected ? <PAE paeImg={props.selected.paeImageUrl} /> : <></>)
    }, [props.selected]);

    let pdbeComponent = <Loader />

    if ("pdb_id" in props.selected) {
        pdbeComponent = <pdbe-molstar id="pdbeMolstarComponent" ref={props.pdbeRef}
                                      bg-color-r="255" bg-color-g="255" bg-color-b="255" hide-controls="true"
                                      molecule-id={props.selected.pdb_id} alphafold-view="false" hide-water="true" />
    } else if ("cifUrl" in props.selected) {
        pdbeComponent = <pdbe-molstar id="pdbeMolstarComponent" ref={props.pdbeRef}
                                      bg-color-r="255" bg-color-g="255" bg-color-b="255" hide-controls="true"
                                      custom-data-url={props.selected.cifUrl} custom-data-format="cif"
                                      alphafold-view="true" hide-water="true" />
    } else if ("a" in props.selected && "b" in props.selected) {
        const modelUrl = API_URL + '/interaction/'+props.selected.a+'/'+props.selected.b+'/model';
        pdbeComponent = <pdbe-molstar id="pdbeMolstarComponent" ref={props.pdbeRef}
                                      bg-color-r="255" bg-color-g="255" bg-color-b="255" hide-controls="true"
                                      custom-data-url={modelUrl} custom-data-format="pdb" alphafold-view="false" hide-water="true" />
    }

    return <PageSpecificStructure component={pdbeComponent} pae={pae}/>
}

interface PageSpecificStructureProps {
    component: JSX.Element
    pae: JSX.Element
 }

const PageSpecificStructure = (props: PageSpecificStructureProps) => {
    return (
        <td colSpan={10} className="expanded-row structure-data-cell">
            <div className="significances-groups">
                <div className="column">
                    <h5><img src={StructureIcon} className="click-icon" alt="structure icon" title="3D structure" /> Structures</h5>
                    {props.component}
                    Click variant to see surrounding residues<br/>
                    Click white space to zoom out to whole structure
                    {props.pae}
                </div>
            </div>
        </td>
    );
}

export default PdbeMolstar;