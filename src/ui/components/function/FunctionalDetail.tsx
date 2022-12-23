import { useState, useEffect } from 'react';

import NoFunctionalDataRow from './NoFunctionalDataRow';
import { Evidence } from '../../../types/ApiInterfaces';
import FunctionalDataRow from './FunctionalDataRow';
import axios from 'axios';
import { API_URL } from '../../../constants/const';
import LoaderRow from '../search/LoaderRow';
import { TranslatedSequence } from '../../../utills/Convertor';

export interface FunctionalResponse {
  position: number
  accession: string
  name: string
  alternativeNames: string
  geneNames: Array<GeneName>
  id: string
  proteinExistence: string
  type: string
  features: Array<ProteinFeature>
  comments: Array<Comment>
  sequence: Sequence
  lastUpdated: string
  dbReferences: Array<DBReference>
  pockets: Array<Pocket>
  interfaces: Array<Interface>
  foldxs: Array<Foldx>
}

export interface GeneName {
  geneName: string
  synonyms: string
}

export interface ProteinFeature {
  begin: number
  end: number
  description: string
  type: string
  category: string
  typeDescription: string
  evidences: Array<Evidence>
}

interface Sequence {
  length: number
  sequence: string
  modified: string
}

export interface DBReference {
  id: string
  type: string
  properties: object
}

export interface Comment {
  type: string
  text: Array<CommentText>
  reaction: Reaction
  interactions: Array<Interaction>
  locations: Array<Locations>
  description: Description
  name: string
  url: string
}
interface CommentText {
  value: string;
  evidences: Array<Evidence>
}

export interface Reaction {
  name: string;
  dbReferences: Array<DBReference>
  evidences: Array<Evidence>
}

export interface Pocket {
  structId: string
  energy: number
  energyPerVol: number
  score: number
  residList: Array<number>
}

export interface Interface {
  protein: string
  chain: string
  pair: string
  residues: Array<number>
}

export interface Foldx {
  proteinAcc: string
  position: number
  wildType: string
  mutatedType: string
  foldxDdq: number
  plddt: number
}

interface Interaction {
  accession1: string
  accession2: string
  gene: string
  interactor1: string
  interactor2: string
  organismDiffer: boolean
  experiments: number
}

interface Locations {
  location: CommentLocation
  topology: CommentLocation
}

interface CommentLocation {
  value: string
}

interface Description {
  value: string
  evidences: Array<Evidence>
}

interface FunctionalDetailProps {
  referenceFunctionUri: string
  refAA: string
  variantAA: string
  ensg: string
  ensp: Array<TranslatedSequence>
}

function FunctionalDetail(props: FunctionalDetailProps) {
  const { referenceFunctionUri } = props;
  const [apiData, setApiData] = useState<FunctionalResponse>()
  useEffect(() => {
    axios.get<FunctionalResponse>(API_URL + referenceFunctionUri)
      .then((response) => {
        setApiData(response.data)
      });
  }, [referenceFunctionUri]);
  if (!apiData)
    return <LoaderRow />
  else if (apiData.id)
    return <FunctionalDataRow apiData={apiData} {...props} />
  else
    return <NoFunctionalDataRow />;
}

export default FunctionalDetail;