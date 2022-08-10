
function EveScoreColors() {
    return (
        <div className="search-results-legends" style={{ float: "unset" }}>
            <strong>EVE score colour</strong>
            <br />
            <br />
            <div className="flex-column">
                <div className="flex">
                    <div className="circle-icon" style={{ background: 'Blue' }}></div>
                    <div className="flex1">Benign</div>
                </div>
                <div className="flex">
                    <div className="circle-icon" style={{ background: 'Red' }}></div>
                    <div className="flex1">Pathogenic</div>
                </div>
                <div className="flex">
                    <div className="circle-icon" style={{ background: 'LightGrey' }}></div>
                    <div className="flex1">Uncertain</div>
                </div>
            </div>
        </div>
    );
}

export default EveScoreColors;
