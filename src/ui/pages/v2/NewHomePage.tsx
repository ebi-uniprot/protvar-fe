import React, { useState } from 'react';
import {Link, NavLink} from 'react-router-dom';

import { BsHouse, BsSearch, BsDownload } from 'react-icons/bs';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import {Nav, Navbar, Badge, Container, Row, Col, Table, Form, Modal, Offcanvas, Stack, Image} from 'react-bootstrap';
import EMBLEBILogo from "../../../images/embl-ebi-logo.svg";
import openTargetsLogo from "../../../images/open-targets-logo.png";
import Spaces from "../../elements/Spaces";
import VariantSearchForm from "./VariantSearchForm";
import {API_URL} from "../../../constants/const";
import SiteBanner from "./SiteBanner";
import ReleaseInfoButton from "./ReleaseInfoButton";


const popover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">ClinVar</Popover.Header>
    <Popover.Body>
      <ul style={{margin: "0px 40px 0px 10px"}}>
        <li>Link 1</li>
        <li>Link 2</li>
        <li>Link 3</li>

      </ul>
    </Popover.Body>
  </Popover>
);

const Example = () => (
  <OverlayTrigger trigger="click" placement="right" overlay={popover}>
    <Button variant="success">ClinVar</Button>
  </OverlayTrigger>
);

const NewLayout = ({ children }: { children: React.ReactNode }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Header/>
      <HorizontalNav/>
      <div className="position-absolute top-0 end-0 mt-2 me-2">
        <ReleaseInfoButton/>
      </div>
      <SiteBanner/>
      <Container fluid>
        <Row>
          <Col md={2} className="bg-light vh-100">
            <SideNav onOpenDrawer={() => setShowDrawer(true)} onOpenModal={() => setShowModal(true)}/>
          </Col>
          <Col md={10} className="p-3">
            {children}
          </Col>
        </Row>
      </Container>
      <Footer/>
      <OffCanvasDrawer show={showDrawer} onClose={() => setShowDrawer(false)}/>
      <ModalComponent show={showModal} onHide={() => setShowModal(false)}/>
    </>
  )
}

const Header = () => (
  <Navbar variant="dark" className="px-3" style={{backgroundColor: "#00709b"}}>
    <Navbar.Brand >
      <img
        alt="Logo"
        src="ProtVar_logo.png"
        width="100"
        className="d-inline-block align-top"
      />
    </Navbar.Brand>
    <Navbar.Text>Contextualising human missense variation</Navbar.Text>
  </Navbar>
);

const HorizontalNav = () => (
  <Nav variant="tabs" className="px-3 justify-content-end">
    <Nav.Item><Nav.Link href="#about">About</Nav.Link></Nav.Item>
    <Nav.Item><Nav.Link href="#contact">Contact</Nav.Link></Nav.Item>
    <Nav.Item><Nav.Link href="#api">API</Nav.Link></Nav.Item>
    <Nav.Item><Nav.Link href="#help">Help</Nav.Link></Nav.Item>
    <Nav.Item><Nav.Link href="#release">Release</Nav.Link></Nav.Item>
  </Nav>
);

interface SideNavProps {
  onOpenDrawer: () => void;
  onOpenModal: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ onOpenDrawer, onOpenModal }) => {
  const totalSearches = sessionStorage.getItem('searchCount') || 0;
  const totalDownloads = sessionStorage.getItem('downloadCount') || 0;

  // @ts-ignore
  return (
    <Nav defaultActiveKey="/" className="flex-column pt-3 small">
      <Nav.Link as={Link} to="/v2" className="active"><i className="bi bi-house" /> Home</Nav.Link>

      <Nav.Link as={Link} to="/v2/search-results">
        <i className="bi bi-search" /> Search Results
        <Badge bg="secondary" className="float-end">{totalSearches}</Badge>
      </Nav.Link>
      <Nav className="ms-4 flex-column">
        <Nav.Link href="#">Recent Search 1</Nav.Link>
        <Nav.Link href="#">Recent Search 2</Nav.Link>
      </Nav>

      <Nav.Link as={Link} to="/v2/downloads">
        <i className="bi bi-download" /> My Downloads
        <Badge bg="secondary" className="float-end">{totalDownloads}</Badge>
      </Nav.Link>
      <Nav className="ms-4 flex-column">
        <Nav.Link href="#">Download 1</Nav.Link>
        <Nav.Link href="#">Download 2</Nav.Link>
      </Nav>

      <Nav.Link onClick={onOpenDrawer}>Open Drawer</Nav.Link>
      <Nav.Link onClick={onOpenModal}>Open Modal</Nav.Link>
    </Nav>
  );
};

interface OffCanvasDrawerProps {
  show: boolean;
  onClose: () => void;
}

const OffCanvasDrawer: React.FC<OffCanvasDrawerProps> = ({ show, onClose }) => {
  const [expanded, setExpanded] = useState(false);

  // Toggle between normal and expanded size
  const toggleSize = () => {
    setExpanded(!expanded);
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" className={expanded ? 'offcanvas-expanded' : ''} style={{ width: expanded ? '50vw' : '' }}>
      <Offcanvas.Header closeButton>
        <Button
          variant="white"
          onClick={toggleSize}
        >
          {expanded ? <i className="bi bi-chevron-right"/> : <i className="bi bi-chevron-left" /> }
        </Button>
        <Offcanvas.Title>Help & Share</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <p>Help section content here...</p>
        <p>Shared URL: <code>https://example.com/share</code></p>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

interface ModalComponentProps {
  show: boolean;
  onHide: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ show, onHide }) => (
  <Modal show={show} onHide={onHide} style={{backgroundColor: "transparent !important"}}>
    <Modal.Header closeButton>
      <Modal.Title>Download Options</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Select download options here.</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>Close</Button>
      <Button variant="primary">Download</Button>
    </Modal.Footer>
  </Modal>
);


const Footer = () => (
  <footer className="bg-light text-center py-3 mt-auto">
    <Container fluid>
      <Row className="p-4">
        <Col className="mx-5">

            <Image src={EMBLEBILogo} alt="EMBL-EBI" rounded width={150} height={150} />

            <Image src={openTargetsLogo} alt="Open Targets" rounded width={150} height={150} />

        </Col>
        <Col>
          <p className="small">EMBL-EBI, Wellcome Genome Campus, Hinxton, Cambridgeshire, CB10 1SD, UK. <br/>+44 (0)1223 49 44 44</p>
        </Col>
      </Row>
      <span className="text-muted small">Copyright © EMBL 2025 | EMBL-EBI is part of the European Molecular Biology Laboratory | Term of use</span>
    </Container>
  </footer>
);

export const HomePagev2 = () => (
  <NewLayout>
  <div>
    <p className="small">
      ProtVar (<strong>Prot</strong>ein <strong>Var</strong>iation) is a
      resource to investigate SNV missense variation (not InDels) in humans by presenting
      annotations which may be relevant to interpretation.
      <br/>
      Variants can be submitted below in genomic or protein formats,
      uploaded or accessed via our <a href={API_URL}
                                      title="ProtVar API" target="_self" className='ref-link'>API</a>.
    </p>

    <VariantSearchForm/>

    <Form>
      <Form.Group controlId="searchQuery">
        <Form.Label>Enter your search query</Form.Label>
        <Form.Control type="text" placeholder="Search..."/>
      </Form.Group>
      <Button variant="primary" className="mt-2">Search</Button>
    </Form>
  </div>
  </NewLayout>
);

export const SearchResultsPagev2 = () => (
  <NewLayout>
    <div>
      <h2>Search Results</h2>
      <Form.Group className="mb-3">
        <Form.Label>Filter Options</Form.Label>
        <Form.Control type="text" placeholder="Filter results..." />
    </Form.Group>
    <Table striped bordered hover>
      <thead>
      <tr>
        <th>#</th>
        <th>Result</th>
        <th>Description</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>1</td>
        <td>Sample Result</td>
        <td>Description here</td>
      </tr>
      </tbody>
    </Table>
  </div>
  </NewLayout>
);

export const DownloadsPagev2 = () => (
  <NewLayout>
  <div>
    <h2>My Downloads</h2>
    <p>List of recent downloads will appear here.</p>
  </div>
  </NewLayout>
);

export const getSessionItem = (key: string) => {
  return sessionStorage.getItem(key);
};

export const setSessionItem = (key: string, value: string) => {
  sessionStorage.setItem(key, value);
};

export const incrementSessionCounter = (key: string) => {
  const current = parseInt(sessionStorage.getItem(key) || '0', 10);
  sessionStorage.setItem(key, (current + 1).toString());
};
