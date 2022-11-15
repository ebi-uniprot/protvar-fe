import DefaultPageLayout from '../../layout/DefaultPageLayout';
import FileUpload from './FileUpload';
import RestApiComponent from './RestApiComponent';
import PasteVariantSearch from './PasteVariantSearch';
import { FileLoadFun } from '../../../utills/AppHelper';
import {Assembly, StringVoidFun} from '../../../constants/CommonTypes';
import { Link } from 'react-router-dom';
import { ABOUT, CONTACT } from '../../../constants/BrowserPaths';

const HomePageContent = (props: HomePageProps) => {
  const { loading, assembly, updateAssembly, fetchFileResult, fetchPasteResult } = props;

  return <>
    <div>
      <p>
        ProtVar is an online service to interpret the effects of missense variants using protein function
        and structure. It utilises UniProt functional residue annotation (Protein function) and the PDBe structural
        residue annotation.
        <br />
      </p>
      <p className="info">
        Submit variants (VCF or HGVS format) by pasting them in the search box below, uploading a file or by using the ProtVar API
      </p>
    </div>
    <div className="wrapper">
      <PasteVariantSearch isLoading={loading} assembly={assembly} updateAssembly={updateAssembly} fetchPasteResult={fetchPasteResult} />
      <FileUpload isLoading={loading} fetchFileResult={fetchFileResult} />
      <RestApiComponent />
    </div>
    <div>
      <br />
      <p className="info">
        More help and information is available in the <Link to={ABOUT} title="About ProtVar's" className="ref-link">about</Link> section.
        <br />
        <br />
        We strive to make ProtVar clear and useful to our users. {' '}
        Please <Link to={CONTACT} title="Contact us" className="ref-link">Contact us</Link> with questions or suggestion you may have.
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
