import RegionProteinProps from "./RegionProteinProps";
import { EmptyElement } from "../../../../constants/ConstElement";
import { INTACT_URL } from "../../../../constants/ExternalUrls";
import { ReactComponent as ChevronDownIcon } from "../../../../images/chevron-down.svg"
import {IntAct, IntActComment} from "../../../../types/Comment";

interface IntActsProps extends RegionProteinProps {
	accession: string
}

function IntActs(props: IntActsProps) {
	const { expandedRegionKey, comments, toggleProteinRegion, accession } = props;
	const intActComments = comments.map(c => c as IntActComment)

	if (intActComments.length > 0 && intActComments[0].interactions && intActComments[0].interactions.length > 0) {
		var gene: string = "";
		var interactor = '';
		var key = 'interactions-' + accession;
		intActComments[0].interactions.forEach((intAct: IntAct) => {
			if (intAct.accession1 === accession) {
				interactor = intAct.interactor1;
				var geneInteractor = intAct.accession2 + '(' + intAct.gene + ')';
				if (gene === "") {
					gene = geneInteractor;
				} else {
					gene = gene + ' | ' + geneInteractor;
				}
			}
		});
		if (gene !== "") {
			return (
				<>
					<label>
						<button type="button" className="collapsible" onClick={_ => toggleProteinRegion(key)}>
							<b>Interactions</b>
							<ChevronDownIcon className="chevronicon" />
						</button>
					</label>

					{expandedRegionKey === key &&
						<ul>{getInteraction(gene, interactor)}</ul>
					}
				</>
			);
		}
	}
	return EmptyElement;
}

function getInteraction(gene: string, interactor: string) {
	return (
		<>
			<label>
				<b>Protein(gene) : </b>
				{gene}
			</label>
			<label>
				<b>IntAct : </b>
				<a href={INTACT_URL + interactor} target="_blank" rel="noreferrer" className="ext-link">
					{interactor}
				</a>
			</label>
		</>
	);
}

export default IntActs;