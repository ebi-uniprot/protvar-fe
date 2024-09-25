import { Link } from 'react-router-dom';
import {HOME} from '../../constants/BrowserPaths';
import DefaultPageLayout from '../layout/DefaultPageLayout';

const NotFoundPageContent = () => (
  <>
    <h4>Not Found</h4>
    <p>The page you are looking for could not be found.</p>
    <Link to={HOME} title="Home page" className="ref-link">Go to homepage</Link>
  </>
);

const NotFoundPage = () => (
  <DefaultPageLayout
    content={<NotFoundPageContent/>}
  />
);

export default NotFoundPage;
