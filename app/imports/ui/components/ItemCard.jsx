import React from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeleteItemButton from './DeleteItemButton';

/** Renders a single row in the List item table. See pages/YourItems.jsx. */
const ItemCard = ({ item }) => (
  <Link className="text-decoration-none" to={`/view_item/${item._id}`}>
    <Card className="h-100 item-card">
      <Card.Header>
        <Card.Img src={item.image} alt={`${item.title} image`} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
      </Card.Header>
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
      </Card.Body>
      {Roles.userIsInRole(Meteor.user(), 'admin') ? (
        <Container className="d-flex justify-content-start">
          <Row>
            <Col>
              <DeleteItemButton item={item} />
            </Col>
          </Row>
        </Container>
      ) : ''}
    </Card>
  </Link>
);

// Require a document to be passed to this component.
ItemCard.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    owner: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ItemCard;
