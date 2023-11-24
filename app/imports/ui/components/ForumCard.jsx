import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MiniProfile from './MiniProfile';

/** Renders a single row in the List item table. See pages/YourItems.jsx. */
const ForumCard = ({ forumRequest, profile }) => (
  <Card className="h-100">
    <Link id="item-cards" to={`/view_forum_request/${forumRequest._id}`}>
      <Card.Header>
        <Card.Title>
          {forumRequest.title}
        </Card.Title>
        <Card.Subtitle>
          Status: {forumRequest.status}
        </Card.Subtitle>
      </Card.Header>
    </Link>
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
      <MiniProfile profile={profile} />
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
  }).isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    contactInfo: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default ForumCard;
