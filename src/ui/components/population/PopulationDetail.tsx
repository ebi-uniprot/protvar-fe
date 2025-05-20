import { useEffect, useState } from 'react';
import PopulationDataRow from './PopulationDataRow';
import LoaderRow from '../../pages/result/LoaderRow';
import {getPopulationData} from "../../../services/ProtVarService";
import {PopulationObservation} from "../../../types/PopulationObservation";
import {GnomadFreq} from "../../../types/MappingResponse";


interface PopulationDetailProps {
  annotation: string
  populationObservationsUri: string
  variantAA: string
  gnomadFreq: GnomadFreq
  gnomadCoord: string
}

function PopulationDetail(props: PopulationDetailProps) {
  const { annotation, populationObservationsUri, variantAA, gnomadFreq, gnomadCoord } = props;
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
    return <PopulationDataRow annotation={annotation} poApiData={poApiData} variantAA={variantAA} gnomadFreq={gnomadFreq} gnomadCoord={gnomadCoord} />
}
export default PopulationDetail;