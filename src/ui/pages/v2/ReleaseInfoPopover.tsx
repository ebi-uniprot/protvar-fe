import React from 'react';
import { Popover } from 'react-bootstrap';
import './ReleaseInfoPopover.css'

const ReleaseInfoPopover = (
  <Popover id="release-info-popover" className="release-info-popover">
    <Popover.Body style={{ fontSize: '0.85rem', whiteSpace: 'pre-line' }}>
      <strong>ProtVar 2025_01</strong><br />
      UI 1.4<br />
      API 1.4<br />
      Data release 2.0
      <hr />
      UniProt 2025_01<br />
      Ensembl 113<br />
      CADD v1.7<br />
      dbSNP b156<br />
      COSMIC v99<br />
      ClinVar 2025-02<br />
      gnomAD v4.1.0
    </Popover.Body>
  </Popover>
);

export default ReleaseInfoPopover;