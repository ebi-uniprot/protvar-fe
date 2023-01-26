import { useEffect, useState } from 'react';
import { ALPHAFOLD_URL } from '../../../constants/ExternalUrls';
import axios from 'axios';
import PdbInfoTable from './PdbInfoTable';
import AlphafoldInfoTable from './AlphafoldInfoTable';
import { API_URL } from '../../../constants/const';
import PdbeMolstar from "./PdbeMolstar";
import InteractionInfoTable from "./InteractionInfoTable";
import LoaderRow from "../search/LoaderRow";
import {P2PInteraction} from "../function/FunctionalDetail";
interface ProteinStructureResponse extends Array<ProteinStructureElement>{
}

interface P2PInteractionResponse extends Array<P2PInteraction>{
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

function StructuralDetail(props: StructuralDetailProps) {
  const { isoFormAccession, aaPosition, proteinStructureUri } = props;
  const [pdbData, setPdbData] = useState(new Array<ProteinStructureElement>());
  const [alphaFoldData, setAlphaFoldData] = useState(new Array<AlphafoldResponseElement>());
  const [selected, setSelected] = useState({type: StructType.PDB, id: "", url: "" });
  const [interactionData, setInteractionData] = useState(Array<P2PInteraction>());

  useEffect(() => {
    axios.get<P2PInteractionResponse>(API_URL + '/interaction/'+isoFormAccession+'/'+aaPosition)
        .then((response) => {
          setInteractionData(response.data)
        })
        .catch((err) => {
          setInteractionData([]);
          console.log(err);
        });
  }, [isoFormAccession, aaPosition]);

  useEffect(() => {
    const url = API_URL + proteinStructureUri;
    axios
      .get<ProteinStructureResponse>(url)
      .then(response => {
        setPdbData(response.data);
        if (response.data.length > 0) {
          setSelected({type: StructType.PDB, id: response.data[0].pdb_id, url: ""});
        }
      })
      .catch((err) => {
        setPdbData([]);
        console.log(err);
      });
  }, [proteinStructureUri]);

  useEffect(() => {
    const url = ALPHAFOLD_URL + isoFormAccession;
    axios
      .get<AlphafoldResponse>(url)
      .then((response) => {
        setAlphaFoldData(response.data);
        /*
        if (response.data.length > 0) {
          setSelected({type: StructType.AF, id: response.data[0].entryId,
            url: response.data[0].cifUrl})
          // if id already set (pdb id), use that, otherwise, use alphaFold id
          // setSelected3DId(id => id ? id : response.data[0].entryId);
        }*/
      })
      .catch((err) => {
        setAlphaFoldData([]);
        console.log(err);
      });
  }, [isoFormAccession]);


  if (!selected.id) {
    return <LoaderRow />
  }

  return (
    <tr key={isoFormAccession}>
      <PdbeMolstar selected={selected} />
      <td colSpan={5} className="expanded-row">
        {pdbData.length > 0 && <>
          <br />
          <PdbInfoTable isoFormAccession={isoFormAccession} pdbApiData={pdbData}
                        selectedPdbId={selected.type === StructType.PDB ? selected.id : ""}
                        setSelected={setSelected} />
        </>}
        {alphaFoldData.length > 0 && <>
          <br />
          <AlphafoldInfoTable isoFormAccession={isoFormAccession} alphaFoldData={alphaFoldData}
                              selectedAlphaFoldId={selected.type === StructType.AF ? selected.id : ""}
                              setSelected={setSelected} aaPos={aaPosition} />
        </>}
        {interactionData.length > 0 && <>
        <br />
        <InteractionInfoTable isoFormAccession={isoFormAccession} interactionData={interactionData}
                            selectedInteraction={selected.type === StructType.CUSTOM ? selected.id : ""}
                            setSelected={setSelected} />
      </>}
      </td>
    </tr>
  );
}

export default StructuralDetail;