import {useState, Fragment} from "react";
import {EmptyElement} from "../../../constants/ConstElement";
import {FEATURES} from "../../../constants/Protein";
import AminoAcidModel from "./AminoAcidModel";
import Evidences from "./Evidences";
import {ReactComponent as ChevronDownIcon} from "../../../images/chevron-down.svg"
import {v1 as uuidv1} from 'uuid';
import {StringVoidFun} from "../../../constants/CommonTypes";
import {aminoAcid3to1Letter, formatRange, getKeyValue} from "../../../utills/Util";
import {FunctionalResponse, Pocket, Foldx, P2PInteraction, ProteinFeature} from "../../../types/FunctionalResponse";
import {MappingRecord} from "../../../utills/Convertor";
import {Prediction, PUBMED_ID} from "./prediction/Prediction";
import {pubmedRef} from "../common/Common";
import {Tooltip} from "../common/Tooltip";
import {Dropdown} from "react-dropdown-now";

interface ResidueRegionTableProps {
  functionalData: FunctionalResponse
  record: MappingRecord
}

function ResidueRegionTable(props: ResidueRegionTableProps) {
  const [expandedRowKey, setExpandedRowKey] = useState('')

  function toggleRow(key: string) {
    setExpandedRowKey(expandedRowKey === key ? '' : key)
  }

  var regions: Array<ProteinFeature> = [];
  var residues: Array<ProteinFeature> = [];
  if (props.functionalData.features && props.functionalData.features.length > 0) {
    props.functionalData.features.forEach((feature) => {
      if (feature.category !== 'VARIANTS') {
        if (feature.begin === feature.end)
          residues.push(feature);
        else
          regions.push(feature);
      }
    });
    const oneLetterVariantAA = aminoAcid3to1Letter(props.record.variantAA!);
    return <table>
      <tbody>
      <tr>
        <th>Variant Residue Position</th>
        <th>Region Containing Variant Position</th>
      </tr>
      <tr>
        <td
          style={{verticalAlign: 'top'}}>{getResidues(residues, props.record, props.functionalData.foldxs, oneLetterVariantAA, expandedRowKey, toggleRow)}</td>
        <td
          style={{verticalAlign: 'top'}}>{getRegions(regions, props.functionalData.accession, props.functionalData.pockets, props.functionalData.interactions, expandedRowKey, toggleRow)}</td>
      </tr>
      </tbody>
    </table>
  }
  return EmptyElement
}

function getResidues(regions: Array<ProteinFeature>, record: MappingRecord, foldxs: Array<Foldx>, oneLetterVariantAA: string | null, expandedRowKey: string, toggleRow: StringVoidFun) {
  let foldxs_ = oneLetterVariantAA ? foldxs.filter(foldx => foldx.mutatedType.toLowerCase() === oneLetterVariantAA) : foldxs
  return <>
    <b>Annotations from UniProt</b>
    {regions.length === 0 && <div>
      No functional data for the variant position
    </div>
    }
    {
      regions.map((region, idx) => {
        return getFeatureList(region, `residue-${idx}`, expandedRowKey, toggleRow);
      })
    }
    <AminoAcidModel refAA={record.refAA!} variantAA={record.variantAA!}/>
    <Prediction record={record} foldxs={foldxs_}/>
  </>
}

function getRegions(regions: Array<ProteinFeature>, accession: string, pockets: Array<Pocket>, interactions: Array<P2PInteraction>, expandedRowKey: string, toggleRow: StringVoidFun) {
  return (<>
    <b>Annotations from UniProt</b>
    {regions.length === 0 && <div>
      No functional data for the region
    </div>
    }
    {
      regions.map((region, idx) => {
        return getFeatureList(region, `region-${idx}`, expandedRowKey, toggleRow);
      })
    }
    {
      (pockets.length > 0 || interactions.length > 0) && <div>
        <b>Structure predictions</b>{pubmedRef(PUBMED_ID.INTERFACES)}
      </div>
    }
    <Pockets pockets={pockets} expandedRowKey={expandedRowKey} toggleRow={toggleRow}/>
    <Interfaces accession={accession} interactions={interactions} expandedRowKey={expandedRowKey}
                toggleRow={toggleRow}/>
  </>);
}

function getFeatureList(feature: ProteinFeature, key: string, expandedRowKey: string, toggleRow: StringVoidFun) {
  let category = '';
  if (getKeyValue(feature.type)(FEATURES)) {
    category = getKeyValue(feature.type)(FEATURES);
  }

  if (feature.description) {
    category = category + '-' + feature.description;
  }

  return <Fragment key={key}>
    <button type="button" className="collapsible" onClick={(e) => toggleRow(key)}>
      {category ? category : 'Unnamed'}
      <ChevronDownIcon className="chevronicon"/>
    </button>
    {getFeatureDetail(key, feature, expandedRowKey)}
  </Fragment>
}

function getFeatureDetail(rowKey: string, feature: ProteinFeature, expandedRowKey: string) {
  if (rowKey === expandedRowKey) {
    return (
      <>
        <ul style={{listStyleType: 'none', display: 'inline-block'}}>
          <li key={uuidv1()}>
            {getPositionLabel(feature.begin, feature.end)}
            <br/>
            <Evidences evidences={feature.evidences}/>
          </li>
        </ul>
      </>
    );
  }
}

function getPositionLabel(begin: number, end: number) {
  if (begin === end)
    return <><b>Position :</b> {begin}</>
  else
    return <><b>Range : </b> {begin} - {end}</>
}

interface PocketsProps {
  pockets: Array<Pocket>
  expandedRowKey: string
  toggleRow: StringVoidFun
}

const POCKET_ICONS = [
  <i className="bi bi-caret-up-fill conf-vhigh"></i>,
  <i className="bi bi-caret-up-fill conf-high"></i>,
  <i className="bi bi-caret-down-fill conf-low"></i>
]

const POCKET_OPTS = [
  {value: -1, label: <>Show all</>},
  {value: 0, label: <>{POCKET_ICONS[0]} &gt;900 - very high pocket confidence</>},
  {value: 1, label: <>{POCKET_ICONS[1]} 800-900 - high pocket confidence</>},
  {value: 2, label: <>{POCKET_ICONS[2]} &lt;800 - low pocket confidence</>}
]

const Pockets = (props: PocketsProps) => {

  const [filteredPockets, setFilteredPockets] = useState(props.pockets)
  const getIcon = (score: number) => {
    if(score > 900) return POCKET_ICONS[0]
    else if(score >= 800 && score <= 900) return POCKET_ICONS[1]
    else return POCKET_ICONS[2]
  }

  if (props.pockets.length === 0) return <></>;

  const filterPockets = (op: any) => {
    setFilteredPockets(props.pockets.filter(p => {
      if (op === 0) return p.score > 900
      else if (op === 1) return (p.score >= 800 && p.score <= 900)
      else if (op === 2) return p.score < 800
      else return true
    }));
  }

  let key = 'pockets-0'
  return <Fragment key={key}>
    <button type="button" className="collapsible" onClick={(e) => props.toggleRow(key)}>
      Pockets containing variant
      <ChevronDownIcon className="chevronicon"/>
    </button>
    {(key === props.expandedRowKey) &&
      <>
      <div className="pred-grid pred-grid-col2">
        <div>Pocket confidence
        </div>
        <div><Dropdown className="pocket-select"
            placeholder="Show all"
            options={POCKET_OPTS}
            onChange={(option) => filterPockets(option.value)}
          />
        </div>
      </div>
        {
          filteredPockets.map((pocket) => {
            return <div key={`pocket-${pocket.pocketId}`} className="pred-grid pred-grid-col2">
              <Tooltip
                tip="The ID of the pocket to distinguish where there are multiple pockets for the same model.">Pocket</Tooltip>
              <div>P{pocket.pocketId}</div>

              <Tooltip
                tip="The score used to measure the confidence in the pocket. Score range 0-1000. Scores above 800 are high confidence and above 900 are very high confidence.">
                Combined score
              </Tooltip>
              <div>{getIcon(pocket.score)} {pocket.score?.toFixed(2)}</div>

              <Tooltip tip="The mean pLDDT of all the residues considered to form the pocket from AlphaFold2 model.">
                Pocket pLDDT mean
              </Tooltip>
              <div>{pocket.meanPlddt?.toFixed(2)}</div>

              <div>Energy per volume</div>
              <div>{pocket.energyPerVol?.toFixed(2)}</div>

              <Tooltip
                tip="Ranges from 0-1. 1.0 corresponds to a pocket entirely buried, 0.0 corresponds to a pocket entirely exposed to the solvent.">
                Buriedness
              </Tooltip>
              <div>{pocket.buriedness?.toFixed(2)}</div>

              <Tooltip tip="A measure of pocket compactness">Radius of gyration</Tooltip>
              <div>{pocket.radGyration?.toFixed(2)}</div>

              <div>Residues</div>
              <div>{formatRange(pocket.resid)}</div>
            </div>
          })
        }
      </>
    }
  </Fragment>
}

interface InterfacesProps {
  accession: string
  interactions: Array<P2PInteraction>
  expandedRowKey: string
  toggleRow: StringVoidFun
}

const Interfaces = (props: InterfacesProps) => {
  if (props.interactions.length === 0) return <></>;

  let key = 'interfaces-0'
  return <Fragment key={key}>
    <button type="button" className="collapsible" onClick={(e) => props.toggleRow(key)}>
      Protein-protein interfaces containing variant
      <ChevronDownIcon className="chevronicon"/>
    </button>
    {(key === props.expandedRowKey) &&
      <>
        Proteins which are predicted to interact with {props.accession} where the variant is at the interface:
        <div className="pred-grid pred-grid-col2">
          <div>Protein</div>
          {//<div>Chain</div>
          }
          <Tooltip tip="pDockQ is a confidence score based on the pLDDT model confidences and number of contacts at an interface. pDockQ>0.23, 70% are well modeled and for pDockQ>0.5, 80% are well modelled.">
            pDockQ
          </Tooltip>
        </div>
        {
          props.interactions.map((interaction, index) => {
            //let chain = 'A'
            let pair = interaction.a

            if (props.accession === interaction.a) {
              //chain = 'B';
              pair = interaction.b;
            }
            return <div key={`interaction-${index+1}`}  className="pred-grid pred-grid-col2">
              {/* <b>Chain :</b> {chain}<br/> */}
              {/* <b>Pair :</b> {pair}<br/> */}
              {/* <b>Residues :</b> {formatRange(resids)} */}
              <div>{pair}</div>
              {//<div>{chain}</div>
              }
              <div>{interaction.pdockq.toFixed(3)}</div>
            </div>
          })
        }
        The interacting structure can be visualised in the 3D structure tab.
      </>
    }
  </Fragment>
}

export default ResidueRegionTable;