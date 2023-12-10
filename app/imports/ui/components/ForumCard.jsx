import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/** Renders a single row in the List item table. See pages/YourItems.jsx. */
const ForumCard = ({ forumRequest, profile, currentUsername }) => (
  <Card className="h-100">
    <Card.Header>
      <Link id="plain-link" to={`/view_forum_request/${forumRequest._id}`}>
        <Card.Title>
          {forumRequest.title}
        </Card.Title>
      </Link>
      <Card.Subtitle>
        Status: {forumRequest.status}
      </Card.Subtitle>
    </Card.Header>
    <Card.Body>
      Requesting:
      <Row>
        <Col>
          Quantity: {forumRequest.requestingQuantity}
        </Col>
      </Row>
      <Row>
        <Col>
          Condition: {forumRequest.requestingCondition}
        </Col>
      </Row>
    </Card.Body>
    <Card.Footer>
      <Link to={`/view_profile/${profile._id}`} id="mini-profile" className="d-flex align-items-center">
        <div className="d-inline-block">
          <Image src={profile.image ? profile.image : '/images/defaultPFP.png'} roundedCircle width={60} />
        </div>
        <Container className="d-inline-block">
          <h6>Poster: {profile.name} {profile.email === currentUsername ? '(you)' : ''}</h6>
          <h6>Posted On: {forumRequest.createdAt.toLocaleDateString()}</h6>
        </Container>
      </Link>
    </Card.Footer>
  </Card>
);

// Require a document to be passed to this component.
ForumCard.propTypes = {
  forumRequest: PropTypes.shape({
    title: PropTypes.string,
    poster: PropTypes.string,
    requestingQuantity: PropTypes.number,
    requestingCondition: PropTypes.string,
    forumText: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
  }).isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    contactInfo: PropTypes.string,
    email: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  currentUsername: PropTypes.string.isRequired,
};

export default ForumCard;
