import DefaultPageLayout from '../../layout/DefaultPageLayout'
import { FileLoadFun } from '../../../utills/AppHelper'
import { Assembly, StringVoidFun } from '../../../constants/CommonTypes'
import { Link } from 'react-router-dom'
import { ABOUT, CONTACT } from '../../../constants/BrowserPaths'
import {API_URL, TITLE} from '../../../constants/const'
import SearchVariant from './SearchVariant'
import { MappingRecord } from '../../../utills/Convertor'
import {FormData} from '../../../types/FormData'
import React, {useEffect} from "react";

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
          resource to investigate SNV missense variation (not InDels) in humans by presenting
          annotations which may be relevant to interpretation.
          <br/>
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
      <div style={{display: 'grid', gridTemplateColumns: '60% auto'}}>
        <div style={{paddingTop: '20px'}}>
          <h5>How to cite ProtVar</h5>
          <p>
            James D Stephenson, Prabhat Totoo, David F Burke, Jürgen Jänes, Pedro Beltrao, Maria J Martin,
            ProtVar: mapping and contextualizing human missense variation, <i>Nucleic Acids Research</i>, 2024;&nbsp;
            <a className="ref-link" href="https://doi.org/10.1093/nar/gkae413"
               target="_blank" rel="noreferrer">https://doi.org/10.1093/nar/gkae413</a>
          </p>

          <p>
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

          <p>
            This site is licensed under a <a
            className="ref-link" href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank" rel="noreferrer">Creative Commons</a> license and uses cookie to improve user's experience.
          </p>
        </div>

        <div className='twitter-content' style={{paddingTop: '20px', paddingBottom: '50px'}}>
          <a className="twitter-timeline" data-width="400" data-height="300" data-theme="light"
             data-chrome="noheader nofooter noborders transparent"
             href="https://twitter.com/EBIProtVar?ref_src=twsrc%5Etfw">Tweets by EBIProtVar</a>
        </div>

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
