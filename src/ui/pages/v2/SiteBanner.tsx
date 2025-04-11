// SiteBanner.tsx
import React, {useEffect, useState} from 'react';
import { Alert, Container, Row, Col } from 'react-bootstrap';
import StatCard from './StatCard';
import Button from "react-bootstrap/Button";
import './SiteBanner.css';

const localStorageKey = 'siteBannerDismissed';

const SiteBanner: React.FC = () => {
  const [show, setShow] = useState(true);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const dismissedFlag = localStorage.getItem(localStorageKey);
    if (dismissedFlag === 'true') {
      setShow(false);
      setDismissed(true);
    }
  }, [localStorageKey]);

  const handleClose = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem(localStorageKey, 'true');
  };

  const handleRestore = () => {
    setShow(true);
    setDismissed(false);
    localStorage.removeItem(localStorageKey);
  };

  if (show) {
    return (
      <Alert variant="info" dismissible onClose={handleClose} className="mb-4 border-0 rounded-0">
        <Container>
          <h5 className="mb-3">🎉 New Release: April 2025</h5>
          <Row xs={1} md={4} className="g-3">
            <Col>
              <StatCard title="Variants Processed" value="2.4M"/>
            </Col>
            <Col>
              <StatCard title="Genes Covered" value="19,873"/>
            </Col>
            <Col>
              <StatCard title="Proteins Mapped" value="18,012"/>
            </Col>
            <Col>
              <StatCard title="ClinVar Integration" value="✔️" footer="Up to March 2025"/>
            </Col>
          </Row>
        </Container>
      </Alert>
    );
  }

  if (dismissed) {
    return (
      <div className="site-banner-restore-btn">
        <Button
          variant="light"
          size="sm"
          onClick={handleRestore}
        >
          Show Banner
        </Button>
      </div>
    );
  }

  return null;
};

// SiteBanner.tsx (Flexible + Dynamic)

interface Stat {
  title: string;
  value: string | number;
  footer?: string;
}

interface SiteBannerProps {
  title: string;
  message?: string | JSX.Element;
  variant?: 'info' | 'warning' | 'danger' | 'success' | 'primary' | 'light' | 'dark';
  stats?: Stat[];
  dismissible?: boolean;
}

const FlexSiteBanner: React.FC<SiteBannerProps> = ({
                                                 title,
                                                 message,
                                                 variant = 'info',
                                                 stats = [],
                                                 dismissible = true,
                                               }) => {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Alert
      variant={variant}
      dismissible={dismissible}
      onClose={() => setShow(false)}
      className="mb-4 border-0 rounded-0"
    >
      <Container>
        <h5 className="mb-2">{title}</h5>
        {message && <div className="mb-3">{message}</div>}
        {stats.length > 0 && (
          <Row xs={1} md={4} className="g-3">
            {stats.map((stat, idx) => (
              <Col key={idx}>
                <StatCard title={stat.title} value={stat.value} footer={stat.footer} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </Alert>
  );
};

// How to Use It
// Release Example:
//<SiteBanner
//   title="🎉 New Release: April 2025"
//   message="Check out what’s new in this release below."
//   stats={[
//     { title: 'Variants Processed', value: '2.4M' },
//     { title: 'Genes Covered', value: '19,873' },
//     { title: 'Proteins Mapped', value: '18,012' },
//     { title: 'ClinVar Integration', value: '✔️', footer: 'Up to March 2025' },
//   ]}
// />
// Warning Example:
// <SiteBanner
//   title="⚠️ Scheduled Maintenance"
//   variant="warning"
//   message="ProtVar will be unavailable on Sunday, April 14 from 01:00–03:00 UTC due to scheduled upgrades."
// />

export default SiteBanner;