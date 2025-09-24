import React from 'react';
import { Link } from 'react-router-dom';
import { ABOUT, CONTACT, HELP, HOME, RELEASE } from '../../../constants/BrowserPaths';
import { API_URL } from '../../../constants/const';
import './Navbar.css';
import SearchBox from "../../components/search/SearchBox";

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

      <div className="navbar-right">
        <SearchBox placeholder="Search ProtVar..." />

        <div className="navbar-links">
          <Link to={ABOUT} title="ProtVar About" id="protvarAbout" className="nav-button">
            <i className="bi bi-info-square"></i>
            About
          </Link>

          <Link to={HELP} title="ProtVar Help" id="protvarHelp" className="nav-button">
            <i className="bi bi-question-circle"></i>
            Help
          </Link>

          <a href={API_URL} title="ProtVar API" target="_blank" rel="noopener noreferrer" className="nav-button">
            <i className="bi bi-box"></i>
            API Docs
          </a>

          <Link to={RELEASE} title="ProtVar Release" id="protvarRelease" className="nav-button">
            <i className="bi bi-tag"></i>
            Release
          </Link>

          <Link to={CONTACT} title="ProtVar Contact" className="nav-button">
            <i className="bi bi-envelope"></i>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;