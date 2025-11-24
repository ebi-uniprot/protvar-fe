import React, {useState, Fragment} from "react";
import {EmptyElement} from "../../../constants/ConstElement";
import AminoAcidModel from "./AminoAcidModel";
import Evidences from "./Evidences";
import {ReactComponent as ChevronDownIcon} from "../../../images/chevron-down.svg"
import {v1 as uuidv1} from 'uuid';
import {StringVoidFun} from "../../../constants/CommonTypes";
import {formatRange} from "../../../utills/Util";
import {FunctionalInfo, Feature} from "../../../types/FunctionalInfo";
import {Prediction} from "./prediction/Prediction";
import {Dropdown} from "react-dropdown-now";
import {AmScore, TranslatedSequence} from "../../../types/MappingResponse";
import {HelpContent} from "../help/HelpContent";
import {HelpButton} from "../help/HelpButton";
import {Interaction, Pocket} from "../../../types/Prediction";

export interface ResidueRegionTableProps {
  functionalData: FunctionalInfo
  refAA: string
  variantAA: string
  ensg: string
  ensp: Array<TranslatedSequence>
  caddScore: string
  amScore: AmScore
}

function ResidueRegionTable(props: ResidueRegionTableProps) {
  const [expandedRowKey, setExpandedRowKey] = useState('')

  function toggleRow(key: string) {
    setExpandedRowKey(expandedRowKey === key ? '' : key)
  }

  var regions: Array<Feature> = [];
  var residues: Array<Feature> = [];
  if (props.functionalData.features && props.functionalData.features.length > 0) {
    props.functionalData.features.forEach((feature) => {
      if (feature.category !== 'VARIANTS') {
        const begin = Number(feature.begin);
        const end = Number(feature.end);
        if (begin === end)
          residues.push(feature);
        else {
          const position = props.functionalData.position;
          // Regions - apply filtering logic here
          // TODO: TEMPORARY FIX - This filtering logic should be implemented on the API side.
          // Once the backend is updated to handle DISULFID filtering correctly,
          // this frontend filtering can be removed.
          let shouldInclude = false;

          if (feature.type === 'DISULFID') {
            // For DISULFID, position must match start OR end exactly
            shouldInclude = (position === begin || position === end);
          } else {
            // For other regions, position must be within range
            shouldInclude = (position >= begin && position <= end);
          }

          if (shouldInclude) {
            regions.push(feature);
          }
        }
      }
    });
    return <table>
      <tbody>
      <tr>
        <th>Variant Residue Position</th>
        <th>Region Containing Variant Position</th>
      </tr>
      <tr>
        <td
          style={{verticalAlign: 'top'}}>{getResidues(residues, props, expandedRowKey, toggleRow)}</td>
        <td
          style={{verticalAlign: 'top'}}>{getRegions(regions, props.functionalData.accession, props.functionalData.pockets, props.functionalData.interactions, expandedRowKey, toggleRow)}</td>
      </tr>
      </tbody>
    </table>
  }
  return EmptyElement
}

function getResidues(regions: Array<Feature>, props: ResidueRegionTableProps, expandedRowKey: string, toggleRow: StringVoidFun) {
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
    <AminoAcidModel refAA={props.refAA} variantAA={props.variantAA!}/>
    <strong>
      <HelpButton title="Predictions" content={<HelpContent name="predictions" />} />
    </strong>
    <Prediction {...props} />
  </>
}

function getRegions(regions: Array<Feature>, accession: string, pockets: Array<Pocket>, interactions: Array<Interaction>, expandedRowKey: string, toggleRow: StringVoidFun) {
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
    <div>
      <strong>
        <HelpButton title="Structure predictions" content={<HelpContent name="predictions"/>}/>
      </strong>
    </div>
    <Pockets pockets={pockets} expandedRowKey={expandedRowKey} toggleRow={toggleRow}/>
    <Interfaces accession={accession} interactions={interactions} expandedRowKey={expandedRowKey}
                toggleRow={toggleRow}/>
  </>);
}

function getFeatureList(feature: Feature, key: string, expandedRowKey: string, toggleRow: StringVoidFun) {
  /*let category = '';
  if (getKeyValue(feature.type)(FEATURES)) {
    category = getKeyValue(feature.type)(FEATURES);
  }

  if (feature.description) {
    category = category + '-' + feature.description;
  }*/

  return <Fragment key={key}>
    <button type="button" className="collapsible" onClick={_ => toggleRow(key)}>
      <span className="badge" style={{margin: "0 5 0 5"}}>{feature.type.toLowerCase()}</span>{feature.description ?? 'Unnamed'}
      <ChevronDownIcon className="chevronicon"/>
    </button>
    {getFeatureDetail(key, feature, expandedRowKey)}
  </Fragment>
}

function getFeatureDetail(rowKey: string, feature: Feature, expandedRowKey: string) {
  if (rowKey === expandedRowKey) {
    return (
      <>
        <ul style={{listStyleType: 'none', display: 'inline-block'}}>
          <li key={uuidv1()}>
            {getPositionLabel(feature.begin, feature.end, feature.type)}
            <br/>
            <Evidences evidences={feature.evidences}/>
          </li>
        </ul>
      </>
    );
  }
}

function getPositionLabel(begin: string, end: string, type: string) {
  if (Number(begin) === Number(end)) {
    return <><b>Position :</b> {begin}</>
  } else if (type === 'DISULFID') {
    // TODO: TEMPORARY FIX - Display disulfide bonds in C-S-S-C notation
    // This should be handled by the API once the backend filtering is implemented
    return <><b>Disulfide bond : </b>C{begin}-S-S-C{end}</>
  } else {
    return <><b>Range : </b> {begin} - {end}</>
  }
}

interface PocketsProps {
  pockets: Array<Pocket>
  expandedRowKey: string
  toggleRow: StringVoidFun
}

const CONFIDENCE_ICONS = [
  <i className="bi bi-caret-up-fill conf-vhigh"></i>,
  <i className="bi bi-caret-up-fill conf-high"></i>,
  <i className="bi bi-caret-down-fill conf-low"></i>,
  <i className="bi bi-caret-down-fill conf-vlow"></i>
]

const CONFIDENCE_LABELS = [
  'very high confidence',
  'high confidence',
  'low confidence',
  'very low confidence'
]

const POCKET_OPTS = [
  {value: -1, label: <>Show all</>},
  {value: 0, label: <>{CONFIDENCE_ICONS[0]} &gt;900 - {CONFIDENCE_LABELS[0]}</>},
  {value: 1, label: <>{CONFIDENCE_ICONS[1]} 800-900 - {CONFIDENCE_LABELS[1]}</>},
  {value: 2, label: <>{CONFIDENCE_ICONS[2]} &lt;800 - {CONFIDENCE_LABELS[2]}</>}
]


const MODEL_CONF = [
  <>{CONFIDENCE_ICONS[0]} {CONFIDENCE_LABELS[0]}</>,
  <>{CONFIDENCE_ICONS[1]} {CONFIDENCE_LABELS[1]}</>,
  <>{CONFIDENCE_ICONS[2]} {CONFIDENCE_LABELS[2]}</>,
  <>{CONFIDENCE_ICONS[3]} {CONFIDENCE_LABELS[3]}</>
]

const getPocketConf = (score: number) => {
  if (score > 900) return MODEL_CONF[0]
  else if (score > 800) return MODEL_CONF[1]
  else return MODEL_CONF[2]
}

const getModelConf = (score: number) => {
  if (score > 90) return MODEL_CONF[0]
  else if (score > 70) return MODEL_CONF[1]
  else if (score > 50) return MODEL_CONF[2]
  else return MODEL_CONF[3]
}

const getInteractionConf = (score: number) => {
  if (score > 0.50) return MODEL_CONF[0]
  else if (score > 0.23) return MODEL_CONF[1]
  else return MODEL_CONF[2]
}

const Pockets = (props: PocketsProps) => {
  const [itemsToShow, setItemsToShow] = useState(PAGE);
  const [filteredPockets, setFilteredPockets] = useState(props.pockets)

  if (props.pockets.length === 0) return <div className="struct-pred">Variant not predicted to be in a pocket</div>
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
    <button type="button" className="collapsible" onClick={_ => props.toggleRow(key)}>
      Pockets containing variant
      <ChevronDownIcon className="chevronicon"/>
    </button>
    {(key === props.expandedRowKey) &&
      <div className="struct-pred">
        <div className="pred-grid pred-grid-col2">
          <div>Pocket confidence
          </div>
          <div><Dropdown className="pred-pocket-conf-dropdown"
                         placeholder="Show all"
                         options={POCKET_OPTS}
                         onChange={(option) => filterPockets(option.value)}
          />
          </div>
        </div>
        {
          // show all
          /*filteredPockets.map((pocket) => {
            return ShowPocket(pocket)
          })
          */
          // show more
          ShowMore_(filteredPockets, ShowPocket, itemsToShow, setItemsToShow, PAGE)
        }
      </div>
    }
  </Fragment>
}

function ShowPocket(pocket: Pocket) {
  return <div key={`pocket-${pocket.pocketId}`} className="pred-grid pred-grid-col2">
    <div>Pocket</div>
    <div>P{pocket.pocketId}</div>

    <div>Combined score</div>
    <div><span className="pocket-conf">{pocket.score.toFixed(2)}</span> {getPocketConf(pocket.score)}</div>

    <div>Pocket pLDDT mean</div>
    <div><span className="pocket-conf">{pocket.meanPlddt.toFixed(2)}</span> {getModelConf(pocket.meanPlddt)}</div>

    <div>Energy per volume</div>
    <div>{pocket.energyPerVol.toFixed(2)} kcal/mol</div>

    <div>Buriedness</div>
    <div>{pocket.buriedness.toFixed(2)}</div>

    <div>Radius of gyration</div>
    <div>{pocket.radGyration.toFixed(2)} Å</div>

    <div>Residues</div>
    <div>{formatRange(pocket.resid)}</div>
  </div>
}

interface InterfacesProps {
  accession: string
  interactions: Array<Interaction>
  expandedRowKey: string
  toggleRow: StringVoidFun
}

const Interfaces = (props: InterfacesProps) => {
  if (!props.interactions || props.interactions.length === 0) return <div className="struct-pred">No P-P interaction predicted at variant position</div>
  let key = 'interfaces-0'
  return <Fragment key={key}>
    <button type="button" className="collapsible" onClick={_ => props.toggleRow(key)}>
      Protein-protein interfaces containing variant
      <ChevronDownIcon className="chevronicon"/>
    </button>
    {(key === props.expandedRowKey) &&
      <div className="struct-pred">
        Proteins which are predicted to interact with {props.accession} where the variant is at the interface:
        <div className="pred-grid pred-grid-col3">
          <div>Protein</div>
          <div>pDockQ</div>
          <div></div>
        </div>
        {
          // show all
          props.interactions.map((interaction, index) => {
            return ShowInteraction(props.accession, interaction, index)
          })
        }
        {
          // show more
          //ShowMore(props.interactions, ShowInteractionAcc(props.accession))
        }
        The interacting structure can be visualised in the 3D structure tab.
      </div>
    }
  </Fragment>
}

/*
function ShowInteractionAcc(acc: string) {
  return function(interaction: Interaction, index: number) {
    return <div key={`interaction-${index + 1}`} className="pred-grid pred-grid-col2">
      <div>{acc === interaction.a ? interaction.b : interaction.a}</div>
      <div>{interaction.pdockq.toFixed(3)}</div>
    </div>
  }
}*/

function ShowInteraction(accession: string, interaction: Interaction, index: number) {
  return <div key={`interaction-${index + 1}`} className="pred-grid pred-grid-col3">
    <div>{accession === interaction.a ? interaction.b : interaction.a}</div>
    <div>{interaction.pdockq.toFixed(3)}</div>
    <div>{getInteractionConf(interaction.pdockq)}</div>
  </div>
}

/*
function ShowMore(items:any[], showItem:any, page: number = PAGE) {
  const [itemsToShow, setItemsToShow] = useState(page);
  return ShowMore_(items, showItem, itemsToShow, setItemsToShow, page)
}*/

function ShowMore_(items: any[], showItem: any, itemsToShow: number, setItemsToShow: any, page: number = 2) {
  const showmore = () => {
    setItemsToShow(Math.min(itemsToShow + page, items.length))
  }
  const showless = () => {
    setItemsToShow(Math.max(itemsToShow - page, page))
  }
  return (
    <div>
      {items.slice(0, itemsToShow).map((item, index) => showItem(item, index))}
      <div style={{textAlign: 'right'}}>
        {(items.length > itemsToShow) && <button className="show-btn" onClick={showmore}>Show More</button>}
        {(itemsToShow > page) && <button className="show-btn" onClick={showless}>Show Less</button>}
      </div>
    </div>
  )
}

const PAGE = 2;

export default ResidueRegionTable;