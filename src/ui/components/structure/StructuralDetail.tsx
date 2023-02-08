import {useEffect, useRef, useState} from 'react';
import { ALPHAFOLD_URL } from '../../../constants/ExternalUrls';
import axios from 'axios';
import PdbInfoTable from './PdbInfoTable';
import AlphafoldInfoTable from './AlphafoldInfoTable';
import { API_URL } from '../../../constants/const';
import PdbeMolstar from "./PdbeMolstar";
import InteractionInfoTable from "./InteractionInfoTable";
import LoaderRow from "../search/LoaderRow";
import {P2PInteraction, Pocket} from "../function/FunctionalDetail";
import PdbeRef from "./PdbeRef";

interface ProteinStructureResponse extends Array<ProteinStructureElement>{
}

export interface ProteinStructureElement {
  chain_id: string,
  pdb_id: string,
  start: number,
  resolution: number,
  experimental_method: string,
}

type AlphafoldResponse = Array<AlphafoldResponseElement>

export interface AlphafoldResponseElement {
  entryId: string,
  gene: string,
  uniprotAccession: string,
  uniprotId: string,
  uniprotDescription: string,
  taxId: number,
  organismScientificName: string,
  uniprotStart: number,
  uniprotEnd: number,
  uniprotSequence: string,
  modelCreatedDate: string,
  latestVersion: number,
  allVersions: Array<number>,
  cifUrl: string,
  bcifUrl: string,
  pdbUrl: string,
  paeImageUrl: string,
  paeDocUrl: string
}

interface StructuralDetailProps {
  isoFormAccession: string,
  aaPosition: number,
  proteinStructureUri: string
}

export enum StructType {
  PDB,
  AF,
  CUSTOM
}

export const baseSettings = {
  bgColor: {
    r: 255, g: 255, b: 255
  },
  hideControls: true
}

function StructuralDetail(props: StructuralDetailProps) {
  const { isoFormAccession, aaPosition, proteinStructureUri } = props;
  const [pdbData, setPdbData] = useState(new Array<ProteinStructureElement>());
  const [alphaFoldData, setAlphaFoldData] = useState(new Array<AlphafoldResponseElement>());
  const [selected, setSelected] = useState({type: StructType.PDB, id: "", url: "" });
  const [interactionData, setInteractionData] = useState(new Array<P2PInteraction>());
  const [pocketData, setPocketData] = useState(new Array<Pocket>());
  const [pdbeRef] = useState(new PdbeRef(useRef(null)))

  useEffect(() => {
    let id = ''
    axios
        .get<ProteinStructureResponse>(API_URL + proteinStructureUri)
        .then(response => {
          setPdbData(response.data);
          if (response.data.length > 0) {
            id = response.data[0].pdb_id
            setSelected({type: StructType.PDB, id: response.data[0].pdb_id, url: ""});
          }
          return axios.get<AlphafoldResponse>(ALPHAFOLD_URL + isoFormAccession)
        })
        .then(response => {
          setAlphaFoldData(response.data);
          if (response.data.length > 0 && !id) {
            // if id already set (pdb id), use that, otherwise, use alphaFold id
            setSelected({
              type: StructType.AF, id: response.data[0].entryId,
              url: response.data[0].cifUrl
            })
          }
          return axios.all([
            axios.get(API_URL + '/interaction/' + isoFormAccession + '/' + aaPosition),
            axios.get(API_URL + '/pocket/' + isoFormAccession + '/' + aaPosition)
          ])
        })
        .then(axios.spread((interaction, pocket) => {
          setInteractionData(interaction.data)
          setPocketData(pocket.data)
        }))
        .catch((err) => {
          console.log(err);
        });
  }, [proteinStructureUri, isoFormAccession, aaPosition]);

  if (!selected.id) {
    return <LoaderRow />
  }

  return (
    <tr key={isoFormAccession}>
      <PdbeMolstar selected={selected} pdbeRef={pdbeRef.ref} />
      <td colSpan={5} className="expanded-row">
        {pdbData.length > 0 && <>
          <br />
          <PdbInfoTable isoFormAccession={isoFormAccession} pdbApiData={pdbData}
                        selectedPdbId={selected.type === StructType.PDB ? selected.id : ""}
                        setSelected={setSelected} pdbeRef={pdbeRef} />
        </>}
        {alphaFoldData.length > 0 && <>
          <br />
          <AlphafoldInfoTable isoFormAccession={isoFormAccession} alphaFoldData={alphaFoldData}
                              selectedAlphaFoldId={selected.type === StructType.AF ? selected.id : ""}
                              setSelected={setSelected} aaPos={aaPosition} pocketData={pocketData} pdbeRef={pdbeRef} />
        </>}
        {interactionData.length > 0 && <>
        <br />
        <InteractionInfoTable isoFormAccession={isoFormAccession} interactionData={interactionData}
                            selectedInteraction={selected.type === StructType.CUSTOM ? selected.id : ""}
                            setSelected={setSelected} pdbeRef={pdbeRef} />
      </>}
      </td>
    </tr>
  );
}

export default StructuralDetail;