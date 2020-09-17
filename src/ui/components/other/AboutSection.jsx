import React from 'react';

const AboutSection = () => (
	<div className="card">
		<section className="card__actions">
			<span className="card-header">
				<p>
					<b>About PepVEP</b>
				</p>
			</span>
		</section>
		<section className="card--has-hover" role="button">
			<div className="card__content">
				<section className="uniprot-card">
					<section className="uniprot-card__left">
						<span>
							PepVEP is an intuitive web resource for scientists to interpret the effects of genomic
							variants on protein function or structure per residue altered by a genomic variant. It
							unites existing genomic and protein EMBL-EBI expertise; providing functional information
							from the Variant Effect Predictor (VEP), UniProt functional residue annotation (Protein
							function), and PDBe structural residue annotation in an integrated platform.
						</span>
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
