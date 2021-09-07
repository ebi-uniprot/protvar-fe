import { TOTAL_COLS } from '../../../constants/SearchResultTable';
import ProteinFunctionTable from './ProteinFunctionTable';
import { FunctionalResponse } from './FunctionalDetail';
import GeneAndTranslatedSequenceTable from './GeneAndTranslatedSequenceTable';
import ProteinInformationTable from './ProteinInformationTable';
import ResidueRegionTable from './ResidueRegionTable';

interface FunctionalDataRowProps {
  apiData: FunctionalResponse
  refAA: string
  variantAA: string
  ensg: string
  ensp: string
}

function FunctionalDataRow(props: FunctionalDataRowProps) {
  const { refAA, variantAA, ensg, ensp, apiData } = props;

  return (
    <tr>
      <td colSpan={TOTAL_COLS} className="expanded-row">
        <div className="significances-groups">
          <div className="column">
            <h5>Reference Function</h5>
            <ResidueRegionTable features={apiData.features} refAA={refAA} variantAA={variantAA} />
            <ProteinFunctionTable comments={apiData.comments} />
            <ProteinInformationTable apiData={apiData} />
            <GeneAndTranslatedSequenceTable ensg={ensg} ensp={ensp} />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default FunctionalDataRow;
