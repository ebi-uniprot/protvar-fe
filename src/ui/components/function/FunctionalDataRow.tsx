import { TOTAL_COLS } from '../../../constants/SearchResultTable';
import ProteinFunctionTable from './ProteinFunctionTable';
import GeneAndTranslatedSequenceTable from './GeneAndTranslatedSequenceTable';
import ProteinInformationTable from './ProteinInformationTable';
import ResidueRegionTable from './ResidueRegionTable';
import {MappingRecord} from '../../../utills/Convertor';
import ProteinIcon from '../../../images/proteins.svg';
import {FunctionalResponse} from "../../../types/FunctionalResponse";

interface FunctionalDataRowProps {
  functionalData: FunctionalResponse
  record: MappingRecord
}

function FunctionalDataRow(props: FunctionalDataRowProps) {
  const { functionalData, record } = props;

  return (
    <tr>
      <td colSpan={TOTAL_COLS} className="expanded-row">
        <div className="significances-groups">
          <div className="column">
            <h5><img src={ProteinIcon} className="click-icon" alt="protein icon" title="Functional information" /> Functional information</h5>
            <ResidueRegionTable functionalData={functionalData} record={record} />
            <ProteinFunctionTable comments={functionalData.comments} />
            <ProteinInformationTable apiData={functionalData} />
            <GeneAndTranslatedSequenceTable ensg={record.ensg!} ensp={record.ensp!} />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default FunctionalDataRow;
