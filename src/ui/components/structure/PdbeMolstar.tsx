import StructureIcon from '../../../images/structures-3d.svg';
import "./PdbeMolstar.css";
import "pdbe-molstar/build/pdbe-molstar-component-3.1.0";
import "pdbe-molstar/build/pdbe-molstar-light-3.1.0.css";
import {useEffect, useRef} from "react";
import { StructType} from "./StructuralDetail";

interface PdbeMolstarProps {
    selected: any
}

const baseSettings = {
    bgColor: {
        r: 255, g: 255, b: 255
    },
    hideControls: true
}

function pdbeSettings (molId: string) {
    return {...baseSettings,
    ...{
        moleculeId: molId
    }}
}
function afSettings (alphaFoldUrl: string) {
    return {...baseSettings,
        ...{customData: {
                url: alphaFoldUrl,
                format: "cif"
            },
            alphafoldView: true
        }}
}
function customSettings (customUrl: string) {
    return {...baseSettings,
        ...{customData: {
                url: customUrl,
                format: "pdb"
            }
        }}
}

const PdbeMolstar = (props: PdbeMolstarProps) => {
    //const [loaded, setLoaded] = useState(false);
    const pdbeRef = useRef(null);

    //useEffect(() => {
    //    window.customElements.whenDefined('pdbe-molstar').then(() => setLoaded(true))
    //}, []); // run once when the component is loaded

    useEffect(() => {
        if (pdbeRef && pdbeRef.current) {
            if (props.selected.type===StructType.PDB) {
                const opts = pdbeSettings(props.selected.id);
                (pdbeRef.current as any).viewerInstance.visual.update(opts);
            } else if (props.selected.type===StructType.AF) {
                const opts = afSettings(props.selected.url);
                (pdbeRef.current as any).viewerInstance.visual.update(opts);
            } else if (props.selected.type===StructType.CUSTOM) {
                const opts = customSettings(props.selected.url);
                (pdbeRef.current as any).viewerInstance.visual.update(opts);
            }
        }
    }, [props]);

    const pdbeComponent = () => {
        switch (props.selected.type) {
            case StructType.PDB:
                return <pdbe-molstar id="pdbeMolstarComponent" ref={pdbeRef}  molecule-id={props.selected.id} hide-controls="true" />;
            case StructType.AF:
                return <pdbe-molstar id="pdbeMolstarComponent" ref={pdbeRef}  custom-data-url={props.selected.url} custom-data-format="cif" alphafold-view="true" hide-controls="true" />;
            case StructType.CUSTOM:
                return <pdbe-molstar id="pdbeMolstarComponent" ref={pdbeRef}  custom-data-url={props.selected.url} custom-data-format="pdb" hide-controls="true" />;
            default:
                return <></>
        }
    }

    /*


    useEffect(() => {
            console.log(pdbeRef);
        }, [loaded] // run when the component is loaded & whenever loaded changes
    );
     */
    return <PageSpecificStructure component={pdbeComponent()} />
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