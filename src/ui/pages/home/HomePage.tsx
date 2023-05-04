import DefaultPageLayout from '../../layout/DefaultPageLayout';
import FileUpload from './FileUpload';
import PasteVariantSearch from './PasteVariantSearch';
import { FileLoadFun } from '../../../utills/AppHelper';
import {Assembly, StringVoidFun} from '../../../constants/CommonTypes';
import { Link } from 'react-router-dom';
import { ABOUT, CONTACT } from '../../../constants/BrowserPaths';
import {API_URL} from "../../../constants/const";

const HomePageContent = (props: HomePageProps) => {
  const { loading, assembly, updateAssembly, fetchFileResult, fetchPasteResult } = props;

  return <>
    <div>
      <p>
        ProtVar (<strong>P</strong>rotein <strong>V</strong>ariation) is a resource to investigate missense variation in humans by presenting annotations which may be relevant to interpretation.
        <br/>
        Variants can be submitted below in genomic or protein formats, uploaded or accessed via our <Link to="" onClick={() => window.open(API_URL + '/docs', '_blank')} title="ProtVar REST API" target="_blank"  rel='noreferrer'> API </Link>.
      </p>
    </div>
    <div className="wrapper">
      <PasteVariantSearch isLoading={loading} assembly={assembly} updateAssembly={updateAssembly} fetchPasteResult={fetchPasteResult} />
      <FileUpload isLoading={loading} fetchFileResult={fetchFileResult} />
    </div>
    <div>
      <br />
      <p className="info">
        Further information can be found in the <Link to={ABOUT} title="About ProtVar's" className="ref-link">ABOUT</Link> section.
        Please <Link to={CONTACT} title="Contact us" className="ref-link">CONTACT</Link> us with specific queries or suggestions.
      </p>
    </div>
  </>
};


interface HomePageProps {
  loading: boolean
  assembly: Assembly
  updateAssembly: (assembly: Assembly) => void
  fetchFileResult: FileLoadFun
  fetchPasteResult: StringVoidFun
}
const HomePage = (props: HomePageProps) => <DefaultPageLayout content={<HomePageContent {...props} />} />;
export default HomePage;
