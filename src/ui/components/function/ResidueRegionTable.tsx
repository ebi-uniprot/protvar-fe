import { useState, Fragment } from "react";
import { EmptyElement } from "../../../constants/Const";
import { FEATURES } from "../../../constants/Protein";
import AminoAcidModel from "./AminoAcidModel";
import Evidences from "../categories/Evidences";
import { ProteinFeature } from "./FunctionalDetail";
import { ReactComponent as ChevronDownIcon } from "franklin-sites/src/svg/chevron-down.svg";
import { v1 as uuidv1 } from 'uuid';
import { StringVoidFun } from "../../../constants/CommonTypes";
import { getKeyValue } from "../../../utills/Util";

interface ResidueRegionTableProps {
  features: Array<ProteinFeature>
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
          <th>Residue</th>
          <th>Region</th>
        </tr>
        <tr>
          <td>{getResidues(residues, props.refAA, props.variantAA, expendedRowKey, toggleRow)}</td>
          <td>{getRegions(regions, expendedRowKey, toggleRow)}</td>
        </tr>
      </tbody>
    </table>
  }
  return EmptyElement
}
function getResidues(regions: Array<ProteinFeature>, refAA: string, variantAA: string, expendedRowKey: string, toggleRow: StringVoidFun) {
  let regionsList: Array<JSX.Element> = [];
  let counter = 0;

  if (regions.length === 0) {
    return <AminoAcidModel refAA={refAA} variantAA={variantAA} />;
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
  </>
}
function getRegions(regions: Array<ProteinFeature>, expendedRowKey: string, toggleRow: StringVoidFun) {
  let regionsList: Array<JSX.Element> = [];
  let counter = 0;

  if (regions.length === 0) {
    return (
      <label style={{ textAlign: 'center', fontWeight: 'bold' }}>
        No functional data for the region
      </label>
    );
  }
  regions.forEach((region) => {
    counter = counter + 1;
    let key = 'region-' + counter;
    var list = getFeatureList(region, key, expendedRowKey, toggleRow);
    regionsList.push(list);
  });
  return regionsList;
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
export default ResidueRegionTable;