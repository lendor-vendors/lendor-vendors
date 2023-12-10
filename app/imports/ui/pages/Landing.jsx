import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { CashStack, ChatLeftText, People, StarHalf } from 'react-bootstrap-icons';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <div id="landing-page">
    <Container>
      <Row>
        <Col className="py-5">
          <h1 style={{ fontSize: '3.25rem' }}>Borrow from,</h1>
          <h1 style={{ fontSize: '3.25rem' }}>connect with,</h1>
          <h1 style={{ fontSize: '3.25rem' }} className="pb-3">and help others.</h1>
          <p className="pb-3" style={{ fontSize: '1.40rem' }}>
            Borrow, lend, and request for items within the UH Manoa community using our website &quot;Lendor Vendors&quot;!
          </p>
          <Button title="Gallery" variant="success" href="/gallery">Get Started</Button>
        </Col>
        <Col className="d-flex justify-content-center align-items-center">
          <People size={350} />
        </Col>
        <hr />
      </Row>
    </Container>
    <Container>
      <h1 style={{ fontSize: '3rem' }} className="py-5 pb-5 text-center">What we offer...</h1>
      <Row className="pt-4">
        <Col className="d-flex justify-content-center ">
          <CashStack size={150} />
        </Col>
        <Col className="text-center pb-5">
          <div style={{ textAlign: 'left' }}>
            <h3 className="pb-3">Borrowing Service</h3>
            <p>
              Save your money and borrow items for free by checking out our gallery page! If you have spare items you don&apos;t need, feel free to post them for others to use.
            </p>
            <Button title="Gallery" variant="success" href="/gallery">View Gallery</Button>
          </div>
        </Col>
      </Row>
      <Row className="py-5">
        <Col className="d-flex justify-content-center align-items-center">
          <ChatLeftText size={150} />
        </Col>
        <Col className="text-center pb-5">
          <div style={{ textAlign: 'left' }}>
            <h3 className="pb-3">Forums</h3>
            <p>
              Don&apos;t see what you need? Make a request for a specific item on our forums that other users can help you out with.
            </p>
            <Button title="Forums" variant="success" href="/forums">View Forums</Button>
          </div>
        </Col>
      </Row>
      <Row className="pb-5">
        <Col className="d-flex justify-content-center align-items-center">
          <StarHalf size={150} />
        </Col>
        <Col className="text-center pb-5">
          <div style={{ textAlign: 'left' }}>
            <h3 className="pb-3">Reviews</h3>
            <p>
              Satisfied/dissatisfied with your experience with another user? Give them a review so others can decide whether to lend to or borrow from them.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Landing;
