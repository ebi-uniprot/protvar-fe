import { useEffect, useState } from 'react';
import PopulationDataRow from './PopulationDataRow';
import NoPopulationDataRow from './NoPopulationDataRow';
import LoaderRow from '../result/LoaderRow';
import {getPopulationData} from "../../../services/ProtVarService";
import {PopulationObservationResponse} from "../../../types/PopulationObservationResponse";


interface PopulationDetailProps {
  annotation: string
  populationObservationsUri: string
  variantAA: string
}

function PopulationDetail(props: PopulationDetailProps) {
  const { annotation, populationObservationsUri, variantAA } = props;
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
  else if (poApiData.proteinColocatedVariant && poApiData.proteinColocatedVariant.length > 0)
    return <PopulationDataRow annotation={annotation} poApiData={poApiData} variantAA={variantAA} />
  else
    return <NoPopulationDataRow />
}
export default PopulationDetail;