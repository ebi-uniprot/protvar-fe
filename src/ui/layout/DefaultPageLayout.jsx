import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import EBIStandardSearch from '../components/search/EBIStandardSearch';
import DefaultPageContent from './DefaultPageContent';

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
							<li className="home-mobile">
								<a href="//www.ebi.ac.uk">EMBL-EBI</a>
							</li>
							<li className="home">
								<a href="//www.ebi.ac.uk">EMBL-EBI</a>
							</li>
							<li className="services">
								<a href="//www.ebi.ac.uk/services">Services</a>
							</li>
							<li className="research">
								<a href="//www.ebi.ac.uk/research">Research</a>
							</li>
							<li className="training">
								<a href="//www.ebi.ac.uk/training">Training</a>
							</li>
							<li className="about">
								<a href="//www.ebi.ac.uk/about">About us</a>
							</li>
							<li className="search">
								<a href="#/" data-toggle="search-global-dropdown">
									<span className="show-for-small-only">Search</span>
								</a>
								<div
									id="search-global-dropdown"
									className="dropdown-pane"
									data-dropdown
									data-options="closeOnClick:true;"
								/>
							</li>
							<li className="float-right search">
								<a href="#" className="inline-block collpased float-left search-toggle">
									<span className="show-for-small-only">Search</span>
								</a>
							</li>
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
								<div className="local-title columns medium-12" id="local-title">
									<nav className="row">
										<ul id="global-nav" className="menu">
											<li>
												<a href={`${BASE_URL}/`} title="Back to PepVEP's homepage">
													PepVEP
												</a>
											</li>
										</ul>
									</nav>
								</div>
								<EBIStandardSearch />
							</div>
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
