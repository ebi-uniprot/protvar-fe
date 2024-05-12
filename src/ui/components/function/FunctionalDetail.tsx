import { useState, useEffect } from 'react';
import NoFunctionalDataRow from './NoFunctionalDataRow';
import FunctionalDataRow from './FunctionalDataRow';
import LoaderRow from '../search/LoaderRow';
import {MappingRecord} from '../../../utills/Convertor';
import {getFunctionalData} from "../../../services/ProtVarService";
import {FunctionalResponse} from "../../../types/FunctionalResponse";


interface FunctionalDetailProps {
  referenceFunctionUri: string
  record: MappingRecord
}

function FunctionalDetail(props: FunctionalDetailProps) {
  const { referenceFunctionUri, record } = props;
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
    return <FunctionalDataRow functionalData={apiData} record={record} />
  else
    return <NoFunctionalDataRow />;
}

export default FunctionalDetail;