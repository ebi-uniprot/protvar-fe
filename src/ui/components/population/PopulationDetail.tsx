import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../constants/const';
import PopulationDataRow from './PopulationDataRow';
import NoPopulationDataRow from './NoPopulationDataRow';
import { Evidence } from '../../../types/ApiInterfaces';
import LoaderRow from '../search/LoaderRow';

export interface PopulationObservationResponse {
  genomicColocatedVariant: any,
  proteinColocatedVariant: Array<ProteinColocatedVariant>
}

export interface ProteinColocatedVariant {
  cytogeneticBand: string,
  wildType: string,
  alternativeSequence: string,
  genomicLocation: string,
  populationFrequencies: Array<PopulationFrequency>,
  predictions: Array<Prediction>,
  xrefs: Array<Xref>,
  evidences: Array<Evidence>,
  association: Array<Association>,
  clinicalSignificances: Array<ClinicalSignificance>
}

interface Prediction {
  predictionValType: string,
  predAlgorithmNameType: string,
  score: number
}

export interface Xref {
  name: string,
  id: string,
  url: string,
  alternativeUrl: string,
  reviewed: any
}

export interface Association {
  name: string,
  description: string,
  dbReferences: Array<Xref>,
  evidences: Array<Evidence>,
  disease: boolean
}

export interface ClinicalSignificance {
  type: string,
  sources: Array<string>
}

export interface PopulationFrequency {
  sourceName: string
  populationName: string
  frequency: number
}

interface PopulationDetailProps {
  populationObservationsUri: string
  variantAA: string
}

function PopulationDetail(props: PopulationDetailProps) {
  const { populationObservationsUri } = props;
  const [poApiData, setPoApiData] = useState<PopulationObservationResponse>();

  useEffect(() => {
    axios.get<PopulationObservationResponse>(API_URL + populationObservationsUri)
      .then(response => {
        setPoApiData(response.data);
      })
      .catch(err => { })
  }, [populationObservationsUri]);
  if (!poApiData)
    return <LoaderRow />
  else if (poApiData.proteinColocatedVariant && poApiData.proteinColocatedVariant.length > 0)
    return <PopulationDataRow poApiData={poApiData} variantAA={props.variantAA} />
  else
    return <NoPopulationDataRow />
}
export default PopulationDetail;