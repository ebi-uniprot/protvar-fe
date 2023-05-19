import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CaddLegendColors from '../../components/search/CaddLegendColors'
import ResultTable from '../../components/search/ResultTable'
import ResultTableButtonsLegend from '../../components/search/ResultTableButtonsLegend'
import DefaultPageLayout from '../../layout/DefaultPageLayout'
import {
  convertApiMappingToTableRecords,
  MappingRecord,
} from '../../../utills/Convertor'
import DownloadModal from '../../modal/DownloadModal'
import { mappings } from '../../../services/ProtVarService'
import LegendModal from '../../modal/LegendModal'

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

const QueryInfoContent = () => (
  <>
    <h4>Query</h4>
    <p>
      Direct access to variant annotations using permanent URL. Examples of
      valid requests using genomic coordinates and protein information are given
      below.
    </p>
    Using genomic coordinates
    <ul>{gExamples}</ul>
    Using protein accession and position
    <ul>{pExamples}</ul>
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

function getQueryFromUrl(location: any) {
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
      return `${chromo} ${pos} ${ref} ${alt}`
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
      return `${acc} ${pos} ${ref} ${alt}`
    }
  }
  return ''
}

const QueryPageContent = () => {
  const location = useLocation()

  const [userInput, setUserInput] = useState('')
  const [searchResults, setSearchResults] = useState<MappingRecord[][][]>([])

  useEffect(() => {
    const query = getQueryFromUrl(location)
    if (query) {
      setUserInput(query)
      mappings([query])
        .then((response) => {
          const records = convertApiMappingToTableRecords(response.data.inputs)
          setSearchResults(records)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [location])

  const queryOutput = userInput ? (
    <>
      <div className="search-results">
        <div className="flex justify-content-space-between float-right">
          <div className="legend-container">
            <LegendModal />
            <DownloadModal pastedInputs={[userInput]} file={null} />
          </div>
        </div>
        <ResultTable mappings={searchResults} />
      </div>
    </>
  ) : (
    <QueryInfoContent />
  )

  //if (!searchResults || searchResults.length < 1) return <>Nothing!</>;

  return <>{queryOutput}</>
}

function QueryPage() {
  return <DefaultPageLayout content={<QueryPageContent />} />
}

export default QueryPage
