import React from 'react';
import { ButtonModal } from 'franklin-sites';
import { v1 as uuidv1 } from 'uuid';

const About = (props) => {
	return (
		<ButtonModal
			className="link"
			buttonText="About"
			title="About"
			withFooterCloseButton={true}
			withHeaderCloseButton={false}
			height="60%"
			width="60%"
		>
			<section>
				<div className="container">
					<span>
						<b>What is PepVEP</b>
						<br />
					</span>
					<div className="text">
						<p>
							PepVEP is an online service to interpret the effects of variants on protein function and
							structure. It utilises functional information from the Ensembl Variant Effect Predictor
							(VEP), the UniProt functional residue annotation (Protein function), and the PDBe structural
							residue annotation.
						</p>
					</div>
					<hr />
					<span>
						<b>Examples:</b>
					</span>
					<div className="text">
						<ul>
							<li key={uuidv1()}>
								VCF
								<br />
								3 165830358 165830358 T/C . . .<br />
								21 43072000 43072000 T/C . . .<br />
							</li>
							<li key={uuidv1()}>
								HGVS
								<br />
								NC_000014.9:g.89993420A>G<br />
								NC_000010.11:g.87933147C>G<br />
							</li>
							<li key={uuidv1()}>
								VCF FILE
								<br />
								#CHROM POS ID REF ALT QUAL FILTER INFO<br />
								21 25891796 . C T . . . <br />
								14 73173574 . C T . . .<br />
							</li>
						</ul>
					</div>
					<hr />
					<span>
						<b>Response:</b>
					</span>

					<div className="text">
						<ul>
							<li key={uuidv1()}>
								The genes and transcripts where the variants are located, with Ensembl identifiers.
							</li>
							<li key={uuidv1()}>
								The proteins and protein isoforms affected by the variants, with UniProt identifiers and
								corresponding amino acid positions and changes.
							</li>
							<li key={uuidv1()}>
								The consequence of your variants on the protein sequence (e.g. stop gained, missense,
								stop lost, frameshift).
							</li>

							<li key={uuidv1()}>SIFT, PolyPhen and CADD scores for changes in the protein sequence.</li>

							<li key={uuidv1()}>
								Known variants in the nucleotide and amino acid position that match your variants, with
								dbSNPs, ClinVar and UniProt variant identifiers.
							</li>
							<li key={uuidv1()}>Population frequency from 1000 Genomes project and gnomAD.</li>

							<li key={uuidv1()}>
								Functional information per amino acid residue affected by your variants (e.g. functional
								domains, and sites like active, binding sites and post-translational modifications).
							</li>
							<li key={uuidv1()}>
								Known disease associations in the amino acid position that match your variants as
								described in UniProt.
							</li>

							<li key={uuidv1()}>
								Known mutagenesis experiments in the amino acid position that match your variants as
								described in UniProt.
							</li>
							<li key={uuidv1()}>
								Known structures and ligand binding sites in the amino acid position that match your
								variants.
							</li>
						</ul>
					</div>
				</div>
			</section>
		</ButtonModal>
	);
};

export default About;
