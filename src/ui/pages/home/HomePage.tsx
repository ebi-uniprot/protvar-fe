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
        Variants can be submitted via pasting in the box in VCF or HGVS format, uploading a file in VCF
        format or using the PepVEP API
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
        Further help and explanations about the data in PepVEP can be found in the "<Link to={ABOUT} title="About PepVEP's">about</Link>"
        section at the top right hand side of the page.
        <br />
        <br />
        We continually strive to make PepVEP clear and useful to our users, to contact PepVEP with
        questions or suggestions please use the "<Link to={CONTACT} title="Contact us">contact</Link>" link at the top of the page.
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
