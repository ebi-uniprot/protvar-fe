import React from 'react';
import { OverlayTrigger, Button } from 'react-bootstrap';
import ReleaseInfoPopover from './ReleaseInfoPopover';

const ReleaseInfoButton = () => (
  <OverlayTrigger
    trigger={['hover', 'focus']}
    placement="bottom"
    overlay={ReleaseInfoPopover}
  >
    <Button
      variant="light"
      size="sm"
      className="release-info-button"
      aria-label="Release info"
    >
      ℹ️
    </Button>
  </OverlayTrigger>
);

export default ReleaseInfoButton;