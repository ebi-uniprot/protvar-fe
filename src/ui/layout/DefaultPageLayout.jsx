import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import EBIStandardSearch from '../components/search/EBIStandardSearch';
import DefaultPageContent from './DefaultPageContent';
import { ButtonModal } from 'franklin-sites';

class DefaultPageLayout extends Component {
	componentDidMount() {
		if (window.ebiFrameworkInvokeScripts) {
			window.ebiFrameworkInvokeScripts();
		}
	}

	render() {
		const { content } = this.props;

		return (
			<Fragment>
				<div id="skip-to">
					<a href="#content">Skip to main content</a>
				</div>

				<header id="masthead-black-bar" className="clearfix masthead-black-bar">
					<nav className="row">
						<ul id="global-nav" className="menu global-nav text-right">
							<li key="logo" className="home-mobile">
								<a href="//www.ebi.ac.uk">EMBL-EBI</a>
							</li>
							<li key="home" className="home">
								<a href="//www.ebi.ac.uk">EMBL-EBI</a>
							</li>
							<li key="services" className="services">
								<a href="//www.ebi.ac.uk/services">Services</a>
							</li>
							<li key="research" className="research">
								<a href="//www.ebi.ac.uk/research">Research</a>
							</li>
							<li key="training" className="training">
								<a href="//www.ebi.ac.uk/training">Training</a>
							</li>
							<li key="about" className="about">
								<a href="//www.ebi.ac.uk/about">About us</a>
							</li>
							{/* <li className="search">
								<a href="#/" data-toggle="search-global-dropdown">
									<span className="show-for-small-only">Search</span>
								</a>
								<div
									id="search-global-dropdown"
									className="dropdown-pane"
									data-dropdown
									data-options="closeOnClick:true;"
								/>
							</li> */}
							{/* <li className="float-right search">
								<a href="#" className="inline-block collpased float-left search-toggle">
									<span className="show-for-small-only">Search</span>
								</a>
							</li> */}
							<li
								id="embl-selector"
								className="float-right show-for-medium embl-selector embl-ebi active"
							>
								<button className="button float-right">&nbsp;</button>
							</li>
						</ul>
					</nav>
				</header>

				<div id="content" className="content">
					<div data-sticky-container>
						<div
							id="masthead"
							className="masthead"
							data-sticky
							data-sticky-on="large"
							data-top-anchor="main-content-area:top"
							data-btm-anchor="main-content-area:bottom"
						>
							<div className="masthead-inner row">
								<div className="navbar">
									<a className="local-title" href={`${BASE_URL}/`} title="Back to PepVEP's homepage">
										<i className="fa fa-fw fa-home" /> PepVEP
									</a>
									<div className="topnav-right">
										<table>
											<tbody>
												<tr>
													<td>
														<ButtonModal
															buttonText="About"
															title="About"
															withFooterCloseButton={true}
															withHeaderCloseButton={true}
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
																			PepVEP is an online service to interpret the
																			effects of variants on protein function and
																			structure. It utilises functional
																			information from the Ensembl Variant Effect
																			Predictor (VEP), the UniProt functional
																			residue annotation (Protein function), and
																			the PDBe structural residue annotation.
																		</p>
																	</div>
																	<hr />
																	<span>
																		<b>Examples:</b>
																	</span>
																	<div className="text">
																		<ul>
																			<li>
																				VCF
																				<br />
																				3 165830358 165830358 T/C . . .<br />
																				21 43072000 43072000 T/C . . .<br />
																			</li>
																			<li>
																				HGVS
																				<br />
																				NC_000014.9:g.89993420A>G<br />
																				NC_000010.11:g.87933147C>G<br />
																			</li>
																			<li>
																				VCF FILE
																				<br />
																				#CHROM POS ID REF ALT QUAL FILTER INFO<br
																				/>
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
																			<li>
																				The genes and transcripts where the
																				variants are located, with Ensembl
																				identifiers.
																			</li>
																			<li>
																				The proteins and protein isoforms
																				affected by the variants, with UniProt
																				identifiers and corresponding amino acid
																				positions and changes.
																			</li>
																			<li>
																				The consequence of your variants on the
																				protein sequence (e.g. stop gained,
																				missense, stop lost, frameshift).
																			</li>

																			<li>
																				SIFT, PolyPhen and CADD scores for
																				changes in the protein sequence.
																			</li>

																			<li>
																				Known variants in the nucleotide and
																				amino acid position that match your
																				variants, with dbSNPs, ClinVar and
																				UniProt variant identifiers.
																			</li>
																			<li>
																				Population frequency from 1000 Genomes
																				project and gnomAD.
																			</li>

																			<li>
																				Functional information per amino acid
																				residue affected by your variants (e.g.
																				functional domains, and sites like
																				active, binding sites and
																				post-translational modifications).
																			</li>
																			<li>
																				Known disease associations in the amino
																				acid position that match your variants
																				as described in UniProt.
																			</li>

																			<li>
																				Known mutagenesis experiments in the
																				amino acid position that match your
																				variants as described in UniProt.
																			</li>
																			<li>
																				Known structures and ligand binding
																				sites in the amino acid position that
																				match your variants.
																			</li>
																		</ul>
																	</div>
																</div>
															</section>
															{/* <span>
															<b>Currently PepVEP supports inputs in below formats :</b>
														</span>
														<ul>
															<li>
																Entering genomic positions of your variants in the
																Search box
																<div className="input-examples">
																	<div>
																		<span className="variant-example">
																			3 165830358 165830358 T/C . . .<br />
																			21 43072000 43072000 T/C . . .<br />
																		</span>
																	</div>
																</div>
															</li>
															<li>
																Entering hgvs in the Search box
																<div className="input-examples">
																	<div>
																		<span className="variant-example">
																			NC_000014.9:g.89993420A>G<br />
																			NC_000010.11:g.87933147C>G<br />
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
														</ul> */}
														</ButtonModal>
													</td>
													<td>
														<ButtonModal
															buttonText="Contact Us"
															title="Contact Us"
															withFooterCloseButton={false}
															withHeaderCloseButton={true}
															height="30%"
															width="30%"
														>
															<div className="container">
																<form>
																	<label for="fname">First Name</label>
																	<input
																		type="text"
																		id="fname"
																		name="firstname"
																		placeholder="Your name.."
																	/>

																	<label for="lname">Last Name</label>
																	<input
																		type="text"
																		id="lname"
																		name="lastname"
																		placeholder="Your last name.."
																	/>

																	<label htmlfor="country">Country</label>
																	<select id="country" name="country">
																		<option value="australia">
																			United Kingdom
																		</option>
																		<option value="canada">Canada</option>
																		<option value="usa">USA</option>
																	</select>

																	<label for="subject">Subject</label>
																	<textarea
																		id="subject"
																		name="subject"
																		placeholder="Write something.."
																		style={{ height: '200px' }}
																	/>

																	<input type="submit" className="button-new" />
																</form>
															</div>
														</ButtonModal>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							{/* <div className="masthead-inner row">
								<div className="local-title columns medium-12" id="local-title">
									<nav className="row">
										<ul id="global-nav" className="menu columns medium-8">
											<li>
												<a href={`${BASE_URL}/`} title="Back to PepVEP's homepage">
													PepVEP
												</a>
											</li>
										</ul>
										<ul id="global-nav" className="menu columns medium-4">
											<li className="pull-right">
												<ButtonModal
													buttonText="About"
													className="button-new"
													title="Enter details"
													withFooterCloseButton={false}
													withHeaderCloseButton={true}
													height="30%"Kh
													width="30%"
												>
													About
												</ButtonModal>
											</li>

											<li className="menu">
												<ButtonModal
													buttonText="Contact Us"
													className="button-new"
													title="Enter details"
													withFooterCloseButton={false}
													withHeaderCloseButton={true}
													height="30%"
													width="30%"
												>
													Contact Us
												</ButtonModal>
											</li>
										</ul>
									</nav>
								</div>
								<EBIStandardSearch />
							</div> */}
						</div>
					</div>

					<section className="row" role="main">
						<div id="main-content-area" className="main-content-area row">
							<div className="small-12 columns">
								<div className="default-page-layout">
									<DefaultPageContent>{content}</DefaultPageContent>
								</div>
							</div>
						</div>
					</section>
				</div>

				<footer id="footer-target">
					<div id="global-footer" className="global-footer">
						<nav id="global-nav-expanded" className="global-nav-expanded row" />
						<section id="ebi-footer-meta" className="ebi-footer-meta row" />
					</div>
				</footer>
			</Fragment>
		);
	}
}

DefaultPageLayout.propTypes = {
	content: PropTypes.element
};

DefaultPageLayout.defaultProps = {
	content: () => <h3>Page Content</h3>
};

export default DefaultPageLayout;
