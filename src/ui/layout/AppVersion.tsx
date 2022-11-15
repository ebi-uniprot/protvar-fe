import React from "react";

function AppVersion() {
    let content;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        content = <div className="badge" >BETA dev</div>
    } else {
        content = <div className="badge">BETA</div>
    }
    return content;
}
export default AppVersion;