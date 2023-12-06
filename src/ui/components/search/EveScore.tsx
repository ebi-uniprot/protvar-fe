export function getEveClassText(eveClass?: number) {
    switch(eveClass) {
        case 1: return "Benign";
        case 2: return "Pathogenic";
        case 3: return "Uncertain";
        default: return "N/A";
    }
}

export interface EveIconProps {
    eveScore?: string
    eveClass?: number
}

export function EveIcon(props: EveIconProps) {
    switch(props.eveClass) {
        case 1: return <i className="eve-benign bi bi-circle-fill"></i>
        case 2: return <i className="eve-pathogenic bi bi-circle-fill"></i>
        case 3: return <i className="eve-uncertain bi bi-circle-fill"></i>
        default: return <></>
    }
}