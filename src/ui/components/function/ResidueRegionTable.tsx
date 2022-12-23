import { useState, Fragment } from "react";
import { EmptyElement } from "../../../constants/Const";
import { FEATURES } from "../../../constants/Protein";
import AminoAcidModel from "./AminoAcidModel";
import Evidences from "./Evidences";
import {Foldx, Interface, Pocket, ProteinFeature} from "./FunctionalDetail";
import { ReactComponent as ChevronDownIcon } from "../../../images/chevron-down.svg"
import { v1 as uuidv1 } from 'uuid';
import { StringVoidFun } from "../../../constants/CommonTypes";
import { getKeyValue } from "../../../utills/Util";

interface ResidueRegionTableProps {
  features: Array<ProteinFeature>
  foldxs: Array<Foldx>
  pockets: Array<Pocket>
  interfaces: Array<Interface>
  refAA: string
  variantAA: string
}
function ResidueRegionTable(props: ResidueRegionTableProps) {
  const [expendedRowKey, setExpendedRowKey] = useState('')
  function toggleRow(key: string) {
    setExpendedRowKey(expendedRowKey === key ? '' : key)
  }

  var regions: Array<ProteinFeature> = [];
  var residues: Array<ProteinFeature> = [];
  if (props.features && props.features.length > 0) {
    props.features.forEach((feature) => {
      if (feature.category !== 'VARIANTS') {
        if (feature.begin === feature.end)
          residues.push(feature);
        else
          regions.push(feature);
      }
    });
    return <table>
      <tbody>
        <tr>
          <th>Variant Residue Position</th>
          <th>Region Containing Variant Position</th>
        </tr>
        <tr>
          <td>{getResidues(residues, props.foldxs, props.refAA, props.variantAA, expendedRowKey, toggleRow)}</td>
          <td>{getRegions(regions, props.pockets, props.interfaces, expendedRowKey, toggleRow)}</td>
        </tr>
      </tbody>
    </table>
  }
  return EmptyElement
}
function getResidues(regions: Array<ProteinFeature>, foldxs: Array<Foldx>, refAA: string, variantAA: string, expendedRowKey: string, toggleRow: StringVoidFun) {
  let regionsList: Array<JSX.Element> = [];
  let counter = 0;

  if (regions.length === 0) {
    return <>
        <AminoAcidModel refAA={refAA} variantAA={variantAA} />
        <FoldxPred foldxs={foldxs} expendedRowKey={expendedRowKey} toggleRow={toggleRow} />
      </>;
  }

  regions.forEach((region) => {
    counter = counter + 1;
    let key = 'residue-' + counter;
    var list = getFeatureList(region, key, expendedRowKey, toggleRow);
    regionsList.push(list);
  });
  return <>
    <AminoAcidModel refAA={refAA} variantAA={variantAA} />
    {regionsList}
    <FoldxPred foldxs={foldxs} expendedRowKey={expendedRowKey} toggleRow={toggleRow} />
  </>
}

function getRegions(regions: Array<ProteinFeature>, pockets: Array<Pocket>, interfaces: Array<Interface>, expendedRowKey: string, toggleRow: StringVoidFun) {
  let regionsList: Array<JSX.Element> = [];
  let counter = 0;

  if (regions.length === 0) {
    return (<>
      <label style={{ textAlign: 'center', fontWeight: 'bold' }}>
        No functional data for the region
      </label>
      <Pockets pockets={pockets} expendedRowKey={expendedRowKey} toggleRow={toggleRow} />
      <Interfaces interfaces={interfaces} expendedRowKey={expendedRowKey} toggleRow={toggleRow} />
    </>);
  }
  regions.forEach((region) => {
    counter = counter + 1;
    let key = 'region-' + counter;
    var list = getFeatureList(region, key, expendedRowKey, toggleRow);
    regionsList.push(list);
  });
  return <>
    {regionsList}
    <Pockets pockets={pockets} expendedRowKey={expendedRowKey} toggleRow={toggleRow} />
    <Interfaces interfaces={interfaces} expendedRowKey={expendedRowKey} toggleRow={toggleRow} />
    </>
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
      {category}
      <ChevronDownIcon className="chevronicon" />
    </button>
    {getFeatureDetail(key, feature, expendedRowKey)}
  </Fragment>
}

function getFeatureDetail(rowKey: string, feature: ProteinFeature, expendedRowKey: string) {
  if (rowKey === expendedRowKey) {
    return (
      <>
        <ul style={{ listStyleType: 'none', display: 'inline-block' }}>
          <li key={uuidv1()}>
            {getPositionLabel(feature.begin, feature.end)}
            <br />
            <Evidences evidences={feature.evidences} />
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

interface FoldxPredProps {
  foldxs: Array<Foldx>
  expendedRowKey: string
  toggleRow: StringVoidFun
}

const FoldxPred = (props: FoldxPredProps) => {
  let key = 'foldxs-0'
  return <Fragment key={key}>
    <button type="button" className="collapsible" onClick={(e) => props.toggleRow(key)}>
      Foldx prediction
      <ChevronDownIcon className="chevronicon" />
    </button>
    {getFoldxDetail(props.foldxs, key, props.expendedRowKey)}
  </Fragment>
}

function getFoldxDetail(foldxs: Array<Foldx>, rowKey: string, expendedRowKey: string) {
  if (rowKey === expendedRowKey) {
    if (foldxs && foldxs.length === 1) {
      return <ul style={{ listStyleType: 'none', display: 'inline-block' }}>
              <li key={uuidv1()}>
                <b title="Difference between the predicted ΔG before and after the variant. A value above 2 often indicates a destabilising variant.">ΔΔG<sub>pred</sub> :</b> {foldxs[0].foldxDdq}
                <br />
                <b title="AlphaFold per-residue confidence score (pLDDT).">pLDDT :</b> {foldxs[0].plddt}
              </li>
            </ul>
    }
    return <NoData />
  }
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
    let key = 'pockets-'+counter
    pocketsList.push(<li key={key}>
          <b>Energy :</b> {pocket.energy}<br/>
          <b>Energy/vol :</b> {pocket.energyPerVol}<br/>
          <b>Score :</b> {pocket.score}<br/>
          <b>Resid :</b> {formatRange(pocket.residList)}
        </li>);
  });

  let key = 'pockets-0'
  return <Fragment key={key}>
    <button type="button" className="collapsible" onClick={(e) => props.toggleRow(key)}>
      Pockets
      <ChevronDownIcon className="chevronicon" />
    </button>
    {getList(pocketsList, key, props.expendedRowKey)}
  </Fragment>
}

interface InterfacesProps {
  interfaces: Array<Interface>
  expendedRowKey: string
  toggleRow: StringVoidFun
}

const Interfaces = (props: InterfacesProps) => {
  let interfacesList: Array<JSX.Element> = [];
  let counter = 0;

  props.interfaces.forEach((interfce) => {
    counter = counter + 1;
    let key = 'interfaces-'+counter
    interfacesList.push(<li key={key}>
      <b>Chain :</b> {interfce.chain}<br/>
      <b>Pair :</b> {interfce.pair}<br/>
      <b>Residues :</b> {formatRange(interfce.residues)}
    </li>);
  });

  let key = 'interfaces-0'
  return <Fragment key={key}>
    <button type="button" className="collapsible" onClick={(e) => props.toggleRow(key)}>
      Interfaces
      <ChevronDownIcon className="chevronicon" />
    </button>
    {getList(interfacesList, key, props.expendedRowKey)}
  </Fragment>
}

function getList(list: Array<JSX.Element>, rowKey: string, expendedRowKey: string) {
  if (rowKey === expendedRowKey) {
    if (list.length === 0) return <NoData />;
    return <ul style={{ listStyleType: 'none', display: 'inline-block' }}>
      {list}
    </ul>
  }
}

const NoData = () => {
  return <label style={{ marginLeft: '10px' }}>No data</label>
}

function formatRange(xs: number[]) {
  if (xs.length === 0)
    return ''
  if (xs.length === 1)
    return xs[0].toString()
  xs.sort(function (a, b) {
    return a - b
  });
  let start = null;
  let end = null;
  let str = ''

  for (let i = 0; i < xs.length; i++) {
    var num = xs[i];
    //initialize
    if (start == null || end == null) {
      start = num;
      end = num;
    }
    //next number in range
    else if (end === num - 1) {
      end = num;
    }
    //there's a gap
    else {
      //range length 1
      if (start === end) {
        str += start + ",";
      }
      //range length 2
      else if (start === end - 1) {
        str += start + "," + end + ",";
      }
      //range lenth 2+
      else {
        str += start + "-" + end + ",";
      }
      start = num;
      end = num;
    }
  }
  if (start !== null && end !== null) {
    if (start === end) {
      str += start;
    } else if (start === end - 1) {
      str += start + "," + end;
    } else {
      str += start + "-" + end;
    }
  }
  if (str.endsWith(",")) {
    str = str.substring(0, str.length - 1)
  }
  return str
}

export default ResidueRegionTable;