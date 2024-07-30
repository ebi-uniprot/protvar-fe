import { useState, useEffect } from 'react';
import NoFunctionalDataRow from './NoFunctionalDataRow';
import FunctionalDataRow from './FunctionalDataRow';
import LoaderRow from '../result/LoaderRow';
import {TranslatedSequence} from '../../../utills/Convertor';
import {getFunctionalData} from "../../../services/ProtVarService";
import {FunctionalResponse} from "../../../types/FunctionalResponse";
import {AMScore, ConservScore, ESMScore, EVEScore} from "../../../types/MappingResponse";


export interface FunctionalDetailProps {
  annotation: string
  referenceFunctionUri: string
  refAA: string
  variantAA: string
  ensg: string
  ensp: Array<TranslatedSequence>
  caddScore: string
  conservScore: ConservScore
  amScore: AMScore
  eveScore: EVEScore
  esmScore: ESMScore
}

function FunctionalDetail(props: FunctionalDetailProps) {
  const { referenceFunctionUri } = props;
  const [apiData, setApiData] = useState<FunctionalResponse>()
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