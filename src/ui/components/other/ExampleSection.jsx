import React from 'react';

const ExampleSection = () => (
	<div className="card">
		<section className="card__actions">
			<span className="card-header">
				<p>
					<b>Variant Input</b>
				</p>
			</span>
		</section>
		<section className="card--has-hover" role="button">
			<div className="card__content">
				<section className="uniprot-card">
					<section className="uniprot-card__left">
						<div className="input-examples">
							<span>Examples:</span>
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
							<div>
								<span>Genomic Position:</span>
								<span className="variant-example">21 43072000 43072000 T/C . . </span>
							</div>
						</div>
					</section>
				</section>
			</div>
		</section>
	</div>
);

export default ExampleSection;
