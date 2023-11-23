import React from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeleteButton from './DeleteButton';

/** Renders a single row in the List item table. See pages/YourItems.jsx. */
const ItemCard = ({ item }) => (
  <Card className="h-100">
    <Card.Header>
      <Card.Img src={item.image} style={{ objectFit: 'cover', minHeight: '150px', maxHeight: '150px', minWidth: '200px', maxWidth: '100%', width: 'auto', height: 'auto' }} />
    </Card.Header>
    <Card.Body>
      <Link id="item-cards" to={`/view_item/${item._id}`}><Card.Title>{item.title}</Card.Title></Link>
    </Card.Body>
    {Roles.userIsInRole(Meteor.user(), 'admin') ? (
      <Container className="d-flex justify-content-start">
        <Row>
          <Col>
            <DeleteButton item={item} />
          </Col>
        </Row>
      </Container>
    ) : ''}
  </Card>
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
