import { useEffect, useState } from 'react';
import { ALPHAFOLD_URL, PDB_URL } from '../../../constants/ExternalUrls';
import axios from 'axios';
import ProtVista3D from './ProtVista3D';
import PdbInfoTable from './PdbInfoTable';
import AlphafoldInfoTable from './AlphafoldInfoTable';
import LoaderRow from '../search/LoaderRow';

interface PdbResponse {
  [isoFormAccession: string]: Array<PdbResponseElement>;
}

export interface PdbResponseElement {
  end: number,
  entity_id: number,
  chain_id: string,
  pdb_id: string,
  start: number,
  unp_end: number,
  coverage: number,
  unp_start: number,
  resolution: number,
  experimental_method: string,
  tax_id: number,
  preferred_assembly_id: number
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
  aaPosition: number
}

function StructuralDetail(props: StructuralDetailProps) {
  const { isoFormAccession, aaPosition } = props;
  const [pdbData, setPdbData] = useState(new Array<PdbResponseElement>());
  const [alphaFoldId, setAlphaFoldId] = useState("");
  const [selected3DId, setSelected3DId] = useState("");

  useEffect(() => {
    const url = PDB_URL + isoFormAccession;
    axios
      .get<PdbResponse>(url)
      .then(response => {
        const filteredData = response.data[isoFormAccession].filter(stand => aaPosition >= stand.unp_start && aaPosition <= stand.unp_end)
        setPdbData(filteredData);
        setSelected3DId(filteredData.length > 0 ? filteredData[0].pdb_id : "")
      })
      .catch((err) => {
        setPdbData([]);
        console.log(err);
      });
  }, [isoFormAccession, aaPosition]);

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
      <td colSpan={5} className="expanded-row">
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