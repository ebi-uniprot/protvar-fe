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
        case 1: return <><div className="circle-icon" style={{ background: 'Blue' }}></div></>;
        case 2: return <><div className="circle-icon" style={{ background: 'Red' }}></div></>
        case 3: return <><div className="circle-icon" style={{ background: 'LightGrey' }}></div></>;
        default: return <>N/A</>;
    }
}