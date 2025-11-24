import { useEffect, useState } from 'react';
import PopulationDataRow from './PopulationDataRow';
import LoaderRow from '../../pages/result/LoaderRow';
import {getPopulationData} from "../../../services/ProtVarService";
import {PopulationObservation} from "../../../types/PopulationObservation";


interface PopulationDetailProps {
  annotation: string
  populationObservationsUri: string
  variantAA: string
  genomicVariant: string
}

function PopulationDetail(props: PopulationDetailProps) {
  const { annotation, populationObservationsUri, variantAA, genomicVariant } = props;
  const [poApiData, setPoApiData] = useState<PopulationObservation>();

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
    return <PopulationDataRow annotation={annotation} poApiData={poApiData} variantAA={variantAA} genomicVariant={genomicVariant} />
}
export default PopulationDetail;