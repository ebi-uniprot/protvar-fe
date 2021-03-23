import React from 'react';
import { ManagedTabs } from 'franklin-sites';

const AboutSection = () => (
	<div className="card">
		<section className="card__actions">
			<span className="card-header">
				<p>
					<b>What to expect</b>
				</p>
			</span>
		</section>
		<section role="button" className="scrollable">
			<div className="card__content">
				<section className="uniprot-card">
					<section className="uniprot-card__left">
						<span>
							<b>Below information will be displayed in search result page :</b>
						</span>
						<div className="container">
							<input id="ch" type="checkbox" />

							<label htmlFor="ch" />
							<div className="text">
								<ul>
									<li>
										The genes and transcripts where the variants are located, with Ensembl
										identifiers.
									</li>
									<li>
										The proteins and protein isoforms affected by the variants, with UniProt
										identifiers and corresponding amino acid positions and changes.
									</li>
									<li>
										The consequence of your variants on the protein sequence (e.g. stop gained,
										missense, stop lost, frameshift).
									</li>

									<li>SIFT, PolyPhen and CADD scores for changes in the protein sequence.</li>

									<li>
										Known variants in the nucleotide and amino acid position that match your
										variants, with dbSNPs, ClinVar and UniProt variant identifiers.
									</li>
									<li>Population frequency from 1000 Genomes project and gnomAD.</li>

									<li>
										Functional information per amino acid residue affected by your variants (e.g.
										functional domains, and sites like active, binding sites and post-translational
										modifications).
									</li>
									<li>
										Known disease associations in the amino acid position that match your variants
										as described in UniProt.
									</li>

									<li>
										Known mutagenesis experiments in the amino acid position that match your
										variants as described in UniProt.
									</li>
									<li>
										Known structures and ligand binding sites in the amino acid position that match
										your variants.
									</li>
								</ul>
							</div>
						</div>
						{/* <span className="assemly-ref-note">
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
						</a> */}
					</section>
				</section>
			</div>
		</section>
	</div>
);

export default AboutSection;
