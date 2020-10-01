import React from 'react';

const AboutSection = () => (
	// <div className="card">
	// 	<section className="card__actions">
	// 		<span className="card-header">
	// 			<p>
	// 				<b>About PepVEP</b>
	// 			</p>
	// 		</span>
	// 	</section>
	// 	<section role="button">
	// 		<div className="card__content">
	// 			<section className="uniprot-card">
	// 				<section className="uniprot-card__left">
	// 					<span>
	// 						PepVEP is an intuitive web resource for scientists to interpret the effects of genomic
	// 						variants on protein function or structure per residue altered by a genomic variant. It
	// 						unites existing genomic and protein EMBL-EBI expertise; providing functional information
	// 						from the Variant Effect Predictor (VEP), UniProt functional residue annotation (Protein
	// 						function), and PDBe structural residue annotation in an integrated platform.
	// 					</span>
	// 				</section>
	// 			</section>
	// 		</div>
	// 	</section>
	// </div>

	<div className="card">
		<section className="card__actions">
			<span className="card-header">
				<p>
					<b>Genome Assembly Remapping</b>
				</p>
			</span>
		</section>
		<section role="button">
			<div className="card__content">
				<section className="uniprot-card">
					<section className="uniprot-card__left">
						<span className="assemly-ref-note">
							<b>Reference Genome Assembly: GRCh38 (hg38) </b>
						</span>
						<p>
							PepVEP variant interpretation is based upon the latest human genome assembly GRCh38(hg38).
							If your variants are referenced to GRCh37(hg19) you will need to remap your variants to the
							latest assembly. We recommend using:
						</p>

						<a
							href="http://www.ensembl.org/Homo_sapiens/Tools/AssemblyConverter?db=core"
							target="_blank"
							rel="noopener noreferrer"
						>
							Ensembl's Assembly Remapping service
						</a>
					</section>
				</section>
			</div>
		</section>
	</div>

	// <div className="about-section">
	//   <h3>About PepVEP</h3>
	//   <p>
	//     PepVEP is an intuitive web resource for scientists to interpret the effects
	//      of genomic variants on protein function or structure per residue altered by
	//      a genomic variant. It unites existing genomic and protein EMBL-EBI expertise;
	//      providing functional information from the Variant Effect Predictor (VEP),
	//      UniProt functional residue annotation (Protein function), and PDBe structural
	//      residue annotation in an integrated platform.
	//   </p>
	// </div>
);

export default AboutSection;
