import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { CashStack, PeopleFill, StarHalf } from 'react-bootstrap-icons';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container id="landing-page" fluid className="py-3">
    <Row className="align-middle text-center">
      <Col xs={4}>
        <CashStack size={100} />
        <h1>Save Money</h1>
        <h5>Borrow items instead of buying brand new ones. If you need something you currently don&apos;t have access to, test your luck and check out the available listed items on our website.</h5>
      </Col>
      <Col xs={4}>
        <PeopleFill size={100} />
        <h1>Help Others</h1>
        <h5>For any one of your belongings you own a spare of or don&apos;t use often, feel free to put them up for others to use. Accept or decline borrow requests from other users.</h5>
      </Col>
      <Col xs={4}>
        <StarHalf size={100} />
        <h1>Rate Your Experience!</h1>
        <h5>Give ratings to your borrowers and lenders based on your experience with them. These will help our users determine who they should be willing to lend to or borrow from.</h5>
      </Col>
    </Row>
  </Container>
);

export default Landing;
