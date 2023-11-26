import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 bg-light">
    <Container>
      <Row>
        <Col className="text-center">
          <h3>Navigation</h3>
          <hr />
          <Link className="text-decoration-none" to="/gallery">Gallery</Link>
          <br />
          <Link className="text-decoration-none" to="/post">Post</Link>
          <br />
          <Link className="text-decoration-none" to="/your_items">Your Items</Link>
          <br />
          <Link className="text-decoration-none" to="/requests">Requests</Link>
        </Col>
        <Col className="text-center">
          <h3>Contact Information</h3>
          <hr />
          Department of Information and Computer Sciences
          {' '}
          <br />
          University of Hawaii
          <br />
          Honolulu, HI 96822
          {' '}
          <br />
          <Link className="text-decoration-none" to="http://ics-software-engineering.github.io/meteor-application-template-react">
            Template Home Page
          </Link>
        </Col>
        <Col className="text-center">
          <h3>About us</h3>
          <hr />
          <Link className="text-decoration-none" to="https://forms.gle/UArKeHu2ejkQPX2o9">Provide Feedback</Link>
          <br />
          <Link className="text-decoration-none" to="/terms">Terms of Service</Link>
          <br />
          <Link className="text-decoration-none" to="https://lendor-vendors.github.io">GitHub</Link>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
