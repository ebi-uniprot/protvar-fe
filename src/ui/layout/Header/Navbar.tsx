import React from 'react';
import { Link } from 'react-router-dom';
import { ABOUT, CONTACT, HELP, HOME, RELEASE } from '../../../constants/BrowserPaths';
import { API_URL } from '../../../constants/const';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={HOME} title="ProtVar homepage" className="brand-link">
          <img
            src="ProtVar_logo.png"
            alt="ProtVar logo"
            width="140"
            className="brand-logo"
          />
        </Link>
        <Link to={HOME} title="ProtVar homepage" className="brand-tagline">
          Contextualising human missense variation
        </Link>
      </div>

      <div className="navbar-nav">
        <Link to={CONTACT} title="ProtVar Contact" className="nav-link">
          Contact
        </Link>
        <a href={API_URL} title="ProtVar API" target="_self" className="nav-link">
          API
        </a>
        <Link to={ABOUT} title="ProtVar About" id="protvarAbout" className="nav-link">
          About
        </Link>
        <Link to={RELEASE} title="ProtVar Release" id="protvarRelease" className="nav-link">
          Release
        </Link>
        <Link to={HELP} title="ProtVar Help" id="protvarHelp" className="nav-link">
          Help <i className="bi bi-info-circle help-icon"></i>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;