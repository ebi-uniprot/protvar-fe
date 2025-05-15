import { useState, useEffect } from 'react';
import NoFunctionalDataRow from './NoFunctionalDataRow';
import FunctionalDataRow from './FunctionalDataRow';
import LoaderRow from '../../pages/result/LoaderRow';
import {getFunctionalData} from "../../../services/ProtVarService";
import {FunctionalInfo} from "../../../types/FunctionalInfo";
import {AmScore, ConservScore, EsmScore, EveScore, TranslatedSequence} from "../../../types/MappingResponse";


export interface FunctionalDetailProps {
  annotation: string
  referenceFunctionUri: string
  refAA: string
  variantAA: string
  ensg: string
  ensp: Array<TranslatedSequence>
  caddScore: string
  conservScore: ConservScore
  amScore: AmScore
  eveScore: EveScore
  esmScore: EsmScore
}

function FunctionalDetail(props: FunctionalDetailProps) {
  const { referenceFunctionUri } = props;
  const [apiData, setApiData] = useState<FunctionalInfo>()
  useEffect(() => {
    getFunctionalData(referenceFunctionUri).then(
        response => {
          setApiData(response.data)
        }
    )
  }, [referenceFunctionUri]);
  if (!apiData)
    return <LoaderRow />
  else if (apiData.id)
    return <FunctionalDataRow functionalData={apiData} {...props} />
  else
    return <NoFunctionalDataRow />;
}

export default FunctionalDetail;