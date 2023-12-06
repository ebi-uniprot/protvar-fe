
function EveScoreColors() {
    return (
        <div className="search-results-legends" style={{ float: "unset" }}>
            <strong>EVE score colour</strong>
            <br />
            <br />
            <div className="flex-column">
                <div className="flex">
                  <span className="padding-left-right-1x">
                    <i className="eve-benign bi bi-circle-fill"></i>
                  </span>
                  <div className="flex1">Benign</div>
                </div>
                <div className="flex">
                  <span className="padding-left-right-1x">
                    <i className="eve-pathogenic bi bi-circle-fill"></i>
                  </span>
                  <div className="flex1">Pathogenic</div>
                </div>
                <div className="flex">
                  <span className="padding-left-right-1x">
                    <i className="eve-uncertain bi bi-circle-fill"></i>
                  </span>
                  <div className="flex1">Uncertain</div>
                </div>
            </div>
        </div>
    );
}

export default EveScoreColors;
