import { useEffect, useState } from 'react';
import PopulationDataRow from './PopulationDataRow';
import NoPopulationDataRow from './NoPopulationDataRow';
import LoaderRow from '../search/LoaderRow';
import {getPopulationData} from "../../../services/ProtVarService";
import {PopulationObservationResponse} from "../../../types/PopulationObservationResponse";


interface PopulationDetailProps {
  populationObservationsUri: string
  variantAA: string
}

function PopulationDetail(props: PopulationDetailProps) {
  const { populationObservationsUri } = props;
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
    return <PopulationDataRow poApiData={poApiData} variantAA={props.variantAA} />
  else
    return <NoPopulationDataRow />
}
export default PopulationDetail;