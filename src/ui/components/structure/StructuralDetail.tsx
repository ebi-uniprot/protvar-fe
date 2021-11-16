import { useEffect, useState } from 'react';
import { ALPHAFOLD_URL } from '../../../constants/ExternalUrls';
import axios from 'axios';
import ProtVista3D from './ProtVista3D';
import PdbInfoTable from './PdbInfoTable';
import AlphafoldInfoTable from './AlphafoldInfoTable';
import LoaderRow from '../search/LoaderRow';
import { API_URL } from '../../../constants/const';
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

interface AlphafoldResponseElement {
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

function StructuralDetail(props: StructuralDetailProps) {
  const { isoFormAccession, aaPosition, proteinStructureUri } = props;
  const [pdbData, setPdbData] = useState(new Array<ProteinStructureElement>());
  const [alphaFoldId, setAlphaFoldId] = useState("");
  const [selected3DId, setSelected3DId] = useState("");

  useEffect(() => {
    const url = API_URL + proteinStructureUri;
    axios
      .get<ProteinStructureResponse>(url)
      .then(response => {
        setPdbData(response.data);
        setSelected3DId(response.data.length > 0 ? response.data[0].pdb_id : "")
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
        if (response.data.length > 0) {
          setAlphaFoldId(response.data[0].entryId)
          setSelected3DId(id => id ? id : response.data[0].entryId)
        }
      })
      .catch((err) => {
        setAlphaFoldId("")
        console.log(err)
      });
  }, [isoFormAccession]);

  const change3dDiagram = (id: string) => {
    setSelected3DId(id);
  }

  if (!selected3DId) {
    return <LoaderRow />
  }

  return (
    <tr key={isoFormAccession}>
      <ProtVista3D accession={isoFormAccession} pos={aaPosition} id={selected3DId} />
      <td colSpan={4} className="expanded-row">
        {pdbData.length > 0 && <>
          <br />
          <PdbInfoTable isoFormAccession={isoFormAccession} pdbApiData={pdbData} selectedPdbId={selected3DId} change3dDiagram={change3dDiagram} />
        </>}
        <br />
        <AlphafoldInfoTable isoFormAccession={isoFormAccession} change3dDiagram={change3dDiagram} alphaFoldId={alphaFoldId}
          selectedAlphaFoldId={selected3DId} aaPos={aaPosition} />
      </td>
    </tr>
  );
}

export default StructuralDetail;