import React from 'react';
import { Link } from 'react-router-dom';
import { STATUS } from '../../../constants/BrowserPaths';
import { useStatus } from '../../../context/StatusContext';
import { overallState } from '../../../types/StatusResponse';
import StatusIndicator, { STATE_LABEL } from '../Header/StatusIndicator';
import VersionInfo from '../VersionInfo';

// Footer line: service status (links to the Status page) and the UI / API / data versions (hover for the data
// sources, click for the release notes)
const FooterStatus: React.FC = () => {
  const { status } = useStatus();
  return (
    <div className="footer-status">
      {status && (
        <span className="footer-status-state">
          <StatusIndicator />
          <Link to={STATUS}>{STATE_LABEL[overallState(status)]}</Link>
        </span>
      )}
      <VersionInfo />
    </div>
  );
};

export default FooterStatus;
