import DefaultPageLayout from '../../layout/DefaultPageLayout';
import FileUpload from './FileUpload';
import RestApiComponent from './RestApiComponent';
import PasteVariantSearch from './PasteVariantSearch';
import { FileLoadFun } from '../../../utills/AppHelper';
import { StringVoidFun } from '../../../constants/CommonTypes';
import { Link } from 'react-router-dom';
import { ABOUT, CONTACT } from '../../../constants/BrowserPaths';

const HomePageContent = (props: HomePageProps) => {
  const { loading, fetchFileResult, fetchPasteResult } = props;

  return <>
    <div>
      <p>
        PepVEP is an online service to interpret the effects of missense variants using protein function
        and structure. It utilises functional information from the Ensembl Variant Effect Predictor
        (VEP), the UniProt functional residue annotation (Protein function), and the PDBe structural
        residue annotation.
        <br />
      </p>
      <p className="info">
        Submit variants (VCF or HGVS format) by pasting them in the search box below, uploading a file or by using the PepVEP API
      </p>
    </div>
    <div className="wrapper">
      <PasteVariantSearch isLoading={loading} fetchPasteResult={fetchPasteResult} />
      <FileUpload isLoading={loading} fetchFileResult={fetchFileResult} />
      <RestApiComponent />
    </div>
    <div>
      <br />
      <p className="info">
        More help and information is available in the <Link to={ABOUT} title="About PepVEP's" className="ref-link">about</Link> section.
        <br />
        <br />
        We strive to make PepVEP clear and useful to our users. <Link to={CONTACT} title="Contact us">Contact us</Link> with questions or suggestions here.
      </p>
    </div>
  </>
};


interface HomePageProps {
  loading: boolean
  fetchFileResult: FileLoadFun
  fetchPasteResult: StringVoidFun
}
const HomePage = (props: HomePageProps) => <DefaultPageLayout content={<HomePageContent {...props} />} />;
export default HomePage;
