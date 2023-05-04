import {Comment} from "../../../../types/FunctionalResponse";
import { ReactComponent as ChevronDownIcon } from "../../../../images/chevron-down.svg"
import RegionProteinProps from "./RegionProteinProps";
import { EmptyElement } from '../../../../constants/ConstElement';

interface RegionProteinAccordionProps extends RegionProteinProps {
  title: string
  detailComponentGenerator: (comment: Comment) => JSX.Element
}
function RegionProteinAccordion(props: RegionProteinAccordionProps) {
  const { expandedRegionKey, comments, toggleProteinRegion, detailComponentGenerator, title } = props;
  const components = comments.map(detailComponentGenerator).filter(element => element !== EmptyElement)
  if (components.length <= 0)
    return EmptyElement

  return <>
    <label>
      <button type="button" className="collapsible" onClick={(e) => toggleProteinRegion(title)}>
        <b>{title}</b>
        <ChevronDownIcon className="chevronicon" />
      </button>
    </label>

    {expandedRegionKey === title &&
      <>{components}</>
    }
  </>
}
export default RegionProteinAccordion;