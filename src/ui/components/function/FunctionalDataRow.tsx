import { TOTAL_COLS } from '../../../constants/SearchResultTable';
import ProteinFunctionTable from './ProteinFunctionTable';
import GeneAndTranslatedSequenceTable from './GeneAndTranslatedSequenceTable';
import ProteinInformationTable from './ProteinInformationTable';
import ResidueRegionTable from './ResidueRegionTable';
import { TranslatedSequence } from '../../../utills/Convertor';
import ProteinIcon from '../../../images/proteins.svg';
import {FunctionalResponse} from "../../../types/FunctionalResponse";

interface FunctionalDataRowProps {
  apiData: FunctionalResponse
  refAA: string
  variantAA: string
  ensg: string
  ensp: Array<TranslatedSequence>
}

function FunctionalDataRow(props: FunctionalDataRowProps) {
  const { refAA, variantAA, ensg, ensp, apiData } = props;

  return (
    <tr>
      <td colSpan={TOTAL_COLS} className="expanded-row">
        <div className="significances-groups">
          <div className="column">
            <h5><img src={ProteinIcon} className="click-icon" alt="protein icon" title="Functional information" /> Reference Function</h5>
            <ResidueRegionTable apiData={apiData} refAA={refAA} variantAA={variantAA} />
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
