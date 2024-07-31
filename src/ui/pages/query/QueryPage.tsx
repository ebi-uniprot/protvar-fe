import {useEffect, useState} from 'react'
import {useLocation, useSearchParams} from 'react-router-dom'
import ResultTable from '../result/ResultTable'
import DefaultPageLayout from '../../layout/DefaultPageLayout'
import DownloadModal from '../../modal/DownloadModal'
import LegendModal from '../../modal/LegendModal'
//import Notify from "../../elements/Notify";
import {TITLE} from "../../../constants/const";
import {mappings} from "../../../services/ProtVarService";
import {PagedMappingResponse, ResultType, toPagedMappingResponse} from "../../../types/PagedMappingResponse";
import {APP_URL} from "../../App";

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

function parseUrlInput(params: URLSearchParams): any {
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
    return [params.get('search')]
  }
  //Notify.warn('Invalid search query.')
  return []
}

const QueryPageContent = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<PagedMappingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const input = parseUrlInput(searchParams)

  useEffect(() => {
    if (input) {
      document.title = input +' - '+ TITLE

        // use original mappings endpoint (response not paged),
        // input not cached
        mappings(input)
          .then((response) => {
            if (response.data && response.data.inputs.length > 0) {
              const mappingResponse = toPagedMappingResponse(response.data)
              setData(mappingResponse)
            }
          })
          .catch((err) => {
            console.log(err);
          }).finally(() => {
            setLoading(false)
        })
    }
  }, [input])

  const shareUrl = `${APP_URL}${location.pathname}${location.search}`

  if (!input) {
    return <QueryInfoContent />
  }

  return <div className="search-results">
    <div className="flex justify-content-space-between float-right">
      {data &&
        <div className="legend-container">
          <button title="Share" style={{fontSize: '20px', color: 'gray'}} onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            alert(`URL copied: ${shareUrl}`)
          }} className="bi bi-share result-op-btn"></button>
          <LegendModal/>
          <DownloadModal type={ResultType.CUSTOM_INPUT}/>
        </div>
      }
    </div>
    <ResultTable loading={loading} data={data}/>
  </div>
}

function QueryPage() {
  return <DefaultPageLayout content={<QueryPageContent />} />
}

export default QueryPage
