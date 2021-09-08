import RegionProteinProps from "./RegionProteinProps";
import { EmptyElement } from "../../../../constants/Const";
import { INTACT_URL } from "../../../../constants/ExternalUrls";
import { ReactComponent as ChevronDownIcon } from "franklin-sites/src/svg/chevron-down.svg";

interface InteractionsProps extends RegionProteinProps {
	accession: string
}

function Interactions(props: InteractionsProps) {
	const { expandedRegionKey, comments, toggleProteinRegion, accession } = props;

	if (comments.length > 0 && comments[0].interactions && comments[0].interactions.length > 0) {
		var gene: string = "";
		var interactor = '';
		var key = 'interactions-' + accession;
		comments[0].interactions.forEach((interaction) => {
			if (interaction.accession1 === accession) {
				interactor = interaction.interactor1;
				var geneInteractor = interaction.accession2 + '(' + interaction.gene + ')';
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
						<button type="button" className="collapsible" onClick={(e) => toggleProteinRegion(key)}>
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
				<b>Gene : </b>
				{gene}
			</label>
			<label>
				<b>IntAct : </b>
				<a href={INTACT_URL + interactor} target="_blank" rel="noreferrer">
					{interactor}
				</a>
			</label>
		</>
	);
}

export default Interactions;