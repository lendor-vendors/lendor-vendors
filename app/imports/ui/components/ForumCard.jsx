import React from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeleteButton from './DeleteButton';

/** Renders a single row in the List item table. See pages/YourItems.jsx. */
const ForumCard = ({ forumRequest }) => (
  <Card className="h-100">
    <Link id="item-cards" to="#">
      <Card.Header>
        {forumRequest.title}
      </Card.Header>
    </Link>
    <Card.Body>
      <Row>
        <Col>
          <Card.Text>
            Quantity: <br />
            {forumRequest.requestingQuantity}
          </Card.Text>
        </Col>
        <Col>
          <Card.Text>
            Condition: <br />
            {forumRequest.requestingCondition}
          </Card.Text>
        </Col>
      </Row>
    </Card.Body>
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
    _id: PropTypes.string,
  }).isRequired,
};

export default ForumCard;
