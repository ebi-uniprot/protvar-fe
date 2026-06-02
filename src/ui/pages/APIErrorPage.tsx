import { Link } from 'react-router-dom';
import { CONTACT, HOME } from '../../constants/BrowserPaths';
import DefaultPageLayout from '../layout/DefaultPageLayout';

const APIErrorContent = () => (
  <div className="error-page">
    <i className="bi bi-exclamation-circle error-page-icon" />
    <h4 className="error-page-title">Something went wrong</h4>
    <p className="error-page-text">
      We couldn&apos;t complete your request — one of our services may be
      temporarily unavailable. Please try again in a few minutes, or{' '}
      <Link to={CONTACT} title="Contact us" className="ref-link">get in touch</Link>{' '}
      if it keeps happening.
    </p>
    <div className="error-page-actions">
      <Link to={HOME} className="btn btn-primary">Back to search</Link>
    </div>
  </div>
);

const APIErrorPage = () => (
  <DefaultPageLayout
    content={<APIErrorContent />}
  />
);

export default APIErrorPage;
