import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ResultTable from '../../components/search/ResultTable'
import DefaultPageLayout from '../../layout/DefaultPageLayout'
import {
  convertApiMappingToTableRecords,
  MappingRecord,
} from '../../../utills/Convertor'
import DownloadModal from '../../modal/DownloadModal'
import { mappings } from '../../../services/ProtVarService'
import LegendModal from '../../modal/LegendModal'
import {FormData, initialFormData} from "../../../types/FormData";
import Notify from "../../elements/Notify";
import Loader from "../../elements/Loader";
import {TITLE} from "../../../constants/const";

// basic tests on query params
const chromosomeRegExp = new RegExp('[a-zA-Z0-9]+')
const positionRegExp = new RegExp('[0-9]+')
const alleleRegExp = new RegExp('[a-zA-Z]')
const accessionRegExp = new RegExp('[a-zA-Z][a-zA-Z0-9]+')
const oneletterAARegExp = new RegExp('[a-zA-Z]')
//const threeletterAARegExp = new RegExp("[a-zA-Z]{3}");

const genomicExamples = [
  '/ProtVar/query?chromosome=19&genomic_position=1010539&reference_allele=G&alternative_allele=C',
  '/ProtVar/query?chromosome=14&genomic_position=89993420&reference_allele=A&alternative_allele=G',
  '/ProtVar/query?chromosome=10&genomic_position=87933147&reference_allele=C&alternative_allele=T',
]
const proteinExamples = [
  '/ProtVar/query?accession=Q4ZIN3&protein_position=558&reference_AA=S&variant_AA=R',
  '/ProtVar/query?accession=Q9NUW8&protein_position=493&reference_AA=H&variant_AA=R',
  '/ProtVar/query?accession=P60484&protein_position=130&reference_AA=R&variant_AA=T',
  '/ProtVar/query?accession=P60484&protein_position=130&reference_AA=N&variant_AA=G',
]
const searchExamples = [
  '/ProtVar/query?search=NC_000021.9:g.25905076A>T',
  '/ProtVar/query?search=rs864622779,P22304 A205P',
]

const gExamples = genomicExamples.map((ex, idx) => (
  <li key={'gEx' + idx}>
    <a href={ex}>{ex}</a>
  </li>
))
const pExamples = proteinExamples.map((ex, idx) => (
    <li key={'pEx' + idx}>
      <a href={ex}>{ex}</a>
    </li>
))
const sExamples = searchExamples.map((ex, idx) => (
    <li key={'sEx' + idx}>
      <a href={ex}>{ex}</a>
    </li>
))

const QueryInfoContent = () => (
  <>
    <h4>Query</h4>

    <p>
      You can access variant annotations directly using the following URL structures and bypassing the
      input screen.
    </p>
    Using genomic coordinates
    <ul>{gExamples}</ul>
    Using protein accession and position
    <ul>{pExamples}</ul>
    Using search terms
    <ul>{sExamples}</ul>
    The search option supports all the accepted formats and up to a maximum of 10 inputs separated by comma.
  </>
)

const requiredGenomicParams = [
  'chromosome',
  'genomic_position',
  'reference_allele',
  'alternative_allele',
]

const requiredProteinParams = [
  'accession',
  'protein_position',
  'reference_AA',
  'variant_AA',
]

function getInputsFromUrl(location: any): any {
  const params = new URLSearchParams(location.search)

  const isGenomicQuery = requiredGenomicParams.reduce(function (acc, p) {
    return acc && params.has(p)
  }, true)

  if (isGenomicQuery) {
    let chromo, pos, ref, alt
    chromo = params.get('chromosome')
    pos = params.get('genomic_position')
    ref = params.get('reference_allele')
    alt = params.get('alternative_allele')

    if (
      chromo &&
      chromosomeRegExp.test(chromo) &&
      pos &&
      positionRegExp.test(pos) &&
      ref &&
      alleleRegExp.test(ref) &&
      alt &&
      alleleRegExp.test(alt)
    ) {
      return [`${chromo} ${pos} ${ref} ${alt}`]
    }
  }

  const isProteinQuery = requiredProteinParams.reduce(function (acc, p) {
    return acc && params.has(p)
  }, true)
  if (isProteinQuery) {
    let acc, pos, ref, alt
    acc = params.get('accession')
    pos = params.get('protein_position')
    ref = params.get('reference_AA')
    alt = params.get('variant_AA')

    if (
      acc &&
      accessionRegExp.test(acc) &&
      pos &&
      positionRegExp.test(pos) &&
      ref &&
      oneletterAARegExp.test(ref) &&
      alt &&
      oneletterAARegExp.test(alt)
    ) {
      return [`${acc} ${pos} ${ref} ${alt}`]
    }
  }

  if (params.has('search')) {
    let str = params.get('search')
    let arr = str?.split(",").map(function(item) {
      return item.trim();
    }).filter(item => item);
    if (arr && arr.length > 0) {
      if (arr.length <= 10) {
        return arr
      }
      else {
        Notify.err('Maximum inputs (10) exceeded.')
        return []
      }
    }
  }
  Notify.warn('Invalid search query.')
  return []
}

const QueryPageContent = () => {
  const location = useLocation()
  const [loaded, setLoaded] = useState(false)
  const [err, setErr] = useState(false)

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [searchResults, setSearchResults] = useState<MappingRecord[][][]>([])

  useEffect(() => {
    const inputs = getInputsFromUrl(location)
    document.title = inputs + ' - ' + TITLE;
    if (inputs.length > 0) {
      formData.userInputs = inputs
      setFormData(formData)
      mappings(formData.userInputs)
        .then((response) => {
          const records = convertApiMappingToTableRecords(response.data)
          setSearchResults(records)
          setLoaded(true)
        })
        .catch((err) => {
          console.log(err)
          setErr(true)
        })
    } else {
      setErr(true)
    }
  }, [location, formData])

  const result = <>
      <div className="search-results">
        <div className="flex justify-content-space-between float-right">
          <div className="legend-container">
            <LegendModal />
            <DownloadModal formData={formData} />
          </div>
        </div>
        <ResultTable mappings={searchResults} />
      </div>
    </>

  //if (!searchResults || searchResults.length < 1) return <>Nothing!</>;

  return <>{loaded ? result : (err ? <QueryInfoContent /> : <Loader />)}</>
}

function QueryPage() {
  return <DefaultPageLayout content={<QueryPageContent />} />
}

export default QueryPage
