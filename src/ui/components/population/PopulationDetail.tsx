import { useEffect, useState } from 'react';
import PopulationDataRow from './PopulationDataRow';
import LoaderRow from '../../pages/result/LoaderRow';
import {getPopulationData} from "../../../services/ProtVarService";
import {PopulationObservationResponse} from "../../../types/PopulationObservationResponse";


interface PopulationDetailProps {
  annotation: string
  populationObservationsUri: string
  variantAA: string
  alleleFreq: number
}

function PopulationDetail(props: PopulationDetailProps) {
  const { annotation, populationObservationsUri, variantAA, alleleFreq } = props;
  const [poApiData, setPoApiData] = useState<PopulationObservationResponse>();

  useEffect(() => {
    getPopulationData(populationObservationsUri).then(
        response => {
          setPoApiData(response.data)
        }
    )
  }, [populationObservationsUri]);

  if (!poApiData)
    return <LoaderRow />
  else
    return <PopulationDataRow annotation={annotation} poApiData={poApiData} variantAA={variantAA} alleleFreq={alleleFreq} />
}
export default PopulationDetail;