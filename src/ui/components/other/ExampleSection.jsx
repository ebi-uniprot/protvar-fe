import React from 'react';

const ExampleSection = () => (
	<div className="card">
		<section className="card__actions">
			<span className="card-header">
				<p>
					<b>How to use</b>
				</p>
			</span>
		</section>
		<section role="button">
			<div className="card__content">
				<section className="uniprot-card">
					<section className="uniprot-card__left">
						<span>
							<b>Currently PepVEP supports inputs in below formats :</b>
						</span>
						<ul>
							<li>
								Entering genomic positions of your variants in the Search box
								<div className="input-examples">
									<div>
										<span className="variant-example">
											<pre>3 165830358 165830358 T/C . . .</pre>
											<pre>21 43072000 43072000 T/C . . .</pre>
										</span>
									</div>
								</div>
							</li>
							<li>
								Entering hgvs in the Search box
								<div className="input-examples">
									<div>
										<span className="variant-example">
											<pre>NC_000014.9:g.89993420A>G</pre>
											<pre>NC_000010.11:g.87933147C>G</pre>
										</span>
									</div>
								</div>
							</li>
							<li>Uploading vcf file using 'UPLOAD FILE' button</li>
							<div className="input-examples">
								<div>
									<span className="variant-example">
										<pre>
											#CHROM POS ID REF ALT QUAL FILTER INFO<br />
											21 25891796 . C T . . . <br />
											14 73173574 . C T . . .<br />
										</pre>
									</span>
								</div>
							</div>
						</ul>

						{/* <div className="input-examples">
							<div>
								<span>Genomic Position:</span>
								<span className="variant-example">3 165830358 165830358 T/C</span>
							</div>
							<div>
								<span>Gene Symbol:</span>
								<span className="variant-example">TP53:p.Arg175His</span>
							</div>
							<div>
								<span>dbSNP HGVS:</span>
								<span className="variant-example">NM_145255.3:c.526C&gt;T</span>
							</div>
						</div> */}
					</section>
				</section>
			</div>
		</section>
	</div>
);

export default ExampleSection;
