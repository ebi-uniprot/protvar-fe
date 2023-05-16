
import { Link } from 'react-router-dom';
import { CONTACT } from '../../constants/BrowserPaths';
import DefaultPageLayout from '../layout/DefaultPageLayout';

const APIErrorContent = () => (
  <>
    <h4>Something went wrong...</h4>
    <p>
      Unfortunately we weren&apos;t able to complete your request. We use various services
      in the background to fulfil each request and sometimes failure of one of these
      services can result in the complete failure of the service.
    </p>
    <p>
      Please try again in a few minutes and get 
      in <Link to={CONTACT} title="Contact us" className="ref-link">touch</Link> with us if the issue persists.
    </p>
  </>
);

const APIErrorPage = () => (
  <DefaultPageLayout
    content={<APIErrorContent />}
  />
);

export default APIErrorPage;
