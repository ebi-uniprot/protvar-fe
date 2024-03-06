import DefaultPageLayout from '../../layout/DefaultPageLayout'
import { Link } from 'react-router-dom'
import { ABOUT, CONTACT } from '../../../constants/BrowserPaths'
import {API_URL, TITLE} from '../../../constants/const'
import {useEffect} from "react";
import SearchVariant from "./SearchVariant";
import {AppState} from "../../App";

const HomePageContent = (props: HomePageProps) => {
  const { loading, state, updateState, submitData } = props

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
          uploaded or accessed via our{' '}
          <Link
            to=""
            onClick={() => window.open(API_URL + '/docs', '_blank')}
            title="ProtVar REST API"
            target="_blank"
            rel="noreferrer"
            className='ref-link'
          >
            {' '}
            API{' '}
          </Link>
          .
        </p>
      </div>
      <div className='search-page-layout'>
        <SearchVariant
          loading={loading}
          state={state}
          updateState={updateState}
          submitData={submitData}
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
  state: AppState
  updateState: any
  submitData: any
}
const HomePage = (props: HomePageProps) => (
  <DefaultPageLayout content={<HomePageContent {...props} />} />
)
export default HomePage
