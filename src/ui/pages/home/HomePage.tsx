import DefaultPageLayout from '../../layout/DefaultPageLayout'
import { FileLoadFun } from '../../../utills/AppHelper'
import { Assembly, StringVoidFun } from '../../../constants/CommonTypes'
import { Link } from 'react-router-dom'
import { ABOUT, CONTACT } from '../../../constants/BrowserPaths'
import {API_URL, TITLE} from '../../../constants/const'
import SearchVariant from './SearchVariant'
import { MappingRecord } from '../../../utills/Convertor'
import {FormData} from '../../../types/FormData'
import {useEffect} from "react";

const HomePageContent = (props: HomePageProps) => {
  const {
    loading,
    formData,
    updateAssembly,
    fetchFileResult,
    fetchPasteResult,
  } = props

  useEffect(() => {
    document.title = TITLE;
  }, []);

  return (
    <>
      <div>
        <p>
          ProtVar (<strong>Prot</strong>ein <strong>Var</strong>iation) is a
          resource to investigate missense variation in humans by presenting
          annotations which may be relevant to interpretation.
          <br />
          Variants can be submitted below in genomic or protein formats,
          uploaded or accessed via our <a href={API_URL}
                                          title="ProtVar API" target="_self" className='ref-link'>API</a>.
        </p>
      </div>
      <div className='search-page-layout'>
        <SearchVariant
          isLoading={loading}
          assembly={formData.assembly}
          updateAssembly={updateAssembly}
          fetchPasteResult={fetchPasteResult}
          fetchFileResult={fetchFileResult}
        />
      </div>
      <div>
        <br />
        <p className="info">
          Further information can be found in the{' '}
          <Link to={ABOUT} title="About ProtVar's" className="ref-link">
            ABOUT
          </Link>{' '}
          section. Please{' '}
          <Link to={CONTACT} title="Contact us" className="ref-link">
            CONTACT
          </Link>{' '}
          us with specific queries or suggestions.
        </p>
      </div>
      <div className='twitter-content'>

        <br/>
        <a className="twitter-timeline" data-width="400" data-height="300" data-theme="light"
           data-chrome="noheader nofooter noborders transparent"
           href="https://twitter.com/EBIProtVar?ref_src=twsrc%5Etfw">Tweets by EBIProtVar</a>
      </div>
    </>
  )
}

interface HomePageProps {
  loading: boolean
  formData: FormData
  updateAssembly: (assembly: Assembly) => void
  fetchFileResult: FileLoadFun
  fetchPasteResult: StringVoidFun
  searchResults: MappingRecord[][][]
}
const HomePage = (props: HomePageProps) => (
  <DefaultPageLayout content={<HomePageContent {...props} />} searchResults={props.searchResults} />
)
export default HomePage
