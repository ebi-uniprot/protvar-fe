import { Link } from 'react-router-dom';
import {CONTACT, HOME} from '../../constants/BrowserPaths';
import DefaultPageLayout from '../layout/DefaultPageLayout';
import { useNoindex } from '../../hooks/useNoindex';

const NotFoundPageContent = () => {
  useNoindex();
  return (
    <div className="error-page">
      <i className="bi bi-compass error-page-icon" />
      <h4 className="error-page-title">Page not found</h4>
      <p className="error-page-text">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Try a variant search from the homepage, or{' '}
        <Link to={CONTACT} title="Contact us" className="ref-link">get in touch</Link>{' '}
        if you followed a link here.
      </p>
      <div className="error-page-actions">
        <Link to={HOME} className="btn btn-primary">Back to search</Link>
      </div>
    </div>
  );
};

const NotFoundPage = () => (
  <DefaultPageLayout
    content={<NotFoundPageContent/>}
  />
);

export default NotFoundPage;
