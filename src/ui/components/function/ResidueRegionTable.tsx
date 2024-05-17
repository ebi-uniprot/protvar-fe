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

interface ResidueRegionTableProps {
  functionalData: FunctionalResponse
  record: MappingRecord
}

function ResidueRegionTable(props: ResidueRegionTableProps) {
  const [expendedRowKey, setExpendedRowKey] = useState('')

  function toggleRow(key: string) {
    setExpendedRowKey(expendedRowKey === key ? '' : key)
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
        <td style={{verticalAlign: 'top' }}>{getResidues(residues, props.record, props.functionalData.foldxs, oneLetterVariantAA, expendedRowKey, toggleRow)}</td>
        <td style={{verticalAlign: 'top' }}>{getRegions(regions, props.functionalData.accession, props.functionalData.pockets, props.functionalData.interactions, expendedRowKey, toggleRow)}</td>
      </tr>
      </tbody>
    </table>
  }
  return EmptyElement
}

function getResidues(regions: Array<ProteinFeature>, record: MappingRecord, foldxs: Array<Foldx>, oneLetterVariantAA: string | null, expendedRowKey: string, toggleRow: StringVoidFun) {
  let foldxs_ = oneLetterVariantAA ? foldxs.filter(foldx => foldx.mutatedType.toLowerCase() === oneLetterVariantAA) : foldxs
  return <>
    <b>Annotations from UniProt</b>
    {regions.length === 0 && <div>
      No functional data for the variant position
    </div>
    }
    {
      regions.map((region, idx) => {
        return getFeatureList(region, `residue-${idx}`, expendedRowKey, toggleRow);
      })
    }
    <AminoAcidModel refAA={record.refAA!} variantAA={record.variantAA!}/>
    <Prediction record={record} foldxs={foldxs_}/>
  </>
}

function getRegions(regions: Array<ProteinFeature>, accession: string, pockets: Array<Pocket>, interactions: Array<P2PInteraction>, expendedRowKey: string, toggleRow: StringVoidFun) {
  return (<>
    <b>Annotations from UniProt</b>
    {regions.length === 0 && <div>
      No functional data for the region
    </div>
    }
    {
      regions.map((region, idx) => {
        return getFeatureList(region, `region-${idx}`, expendedRowKey, toggleRow);
      })
    }
    {
      (pockets.length > 0 || interactions.length >0) && <>
        <b>Structure predictions</b>{pubmedRef(PUBMED_ID.INTERFACES)}
      </>
    }
    <Pockets pockets={pockets} expendedRowKey={expendedRowKey} toggleRow={toggleRow}/>
    <Interfaces accession={accession} interactions={interactions} expendedRowKey={expendedRowKey}
                toggleRow={toggleRow}/>
  </>);
}

function getFeatureList(feature: ProteinFeature, key: string, expendedRowKey: string, toggleRow: StringVoidFun) {
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
    {getFeatureDetail(key, feature, expendedRowKey)}
  </Fragment>
}

function getFeatureDetail(rowKey: string, feature: ProteinFeature, expendedRowKey: string) {
  if (rowKey === expendedRowKey) {
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
  expendedRowKey: string
  toggleRow: StringVoidFun
}

const Pockets = (props: PocketsProps) => {
  let pocketsList: Array<JSX.Element> = [];
  let counter = 0;

  props.pockets.forEach((pocket) => {
    counter = counter + 1;
    let key = 'pockets-' + counter
    pocketsList.push(<li key={key}>
      <b>Energy :</b> {pocket.energy}<br/>
      <b>Energy/vol :</b> {pocket.energyPerVol}<br/>
      <b>Score :</b> {pocket.score}<br/>
      <b>Resid :</b> {formatRange(pocket.residList)}
    </li>);
  });

  if (pocketsList.length === 0) return <></>;

  let key = 'pockets-0'
  return <Fragment key={key}>
    <button type="button" className="collapsible" onClick={(e) => props.toggleRow(key)}>
      Pockets containing variant
      <ChevronDownIcon className="chevronicon"/>
    </button>
    {getList(pocketsList, key, props.expendedRowKey)}
  </Fragment>
}

interface InterfacesProps {
  accession: string
  interactions: Array<P2PInteraction>
  expendedRowKey: string
  toggleRow: StringVoidFun
}

const Interfaces = (props: InterfacesProps) => {
  let interfacesList: Array<JSX.Element> = [];
  let counter = 0;

  props.interactions.forEach((interaction) => {
    counter = counter + 1;
    let key = 'interfaces-' + counter
    let chain = 'A'
    let pair = interaction.a

    if (props.accession === interaction.a) {
      chain = 'B';
      pair = interaction.b;
    }
    interfacesList.push(<li key={key}>
      {/* <b>Chain :</b> {chain}<br/> */}
      {/* <b>Pair :</b> {pair}<br/> */}
      {/* <b>Residues :</b> {formatRange(resids)} */}
      <b>{pair}</b> (Chain {chain}) (pDockQ: {interaction.pdockq.toFixed(3)})
    </li>);
  });

  if (interfacesList.length === 0) return <></>;

  let key = 'interfaces-0'
  return <Fragment key={key}>
    <button type="button" className="collapsible" onClick={(e) => props.toggleRow(key)}>
      Protein-protein interfaces containing variant
      <ChevronDownIcon className="chevronicon"/>
    </button>
    {getList(interfacesList, key, props.expendedRowKey)}
  </Fragment>
}

function getList(list: Array<JSX.Element>, rowKey: string, expendedRowKey: string) {
  if (rowKey === expendedRowKey) {
    return <ul style={{listStyleType: 'none', display: 'inline-block'}}>
      {list}
    </ul>
  }
}

export default ResidueRegionTable;