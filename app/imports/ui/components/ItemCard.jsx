import React from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeleteButton from './DeleteButton';

/** Renders a single row in the List item table. See pages/YourItems.jsx. */
const ItemCard = ({ item }) => (
  <Card className="h-100">
    <Link id="item-cards" to={`/view_item/${item._id}`}>
      <Card.Header>
        <Card.Img src={item.image} alt={`${item.title} image`} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
      </Card.Header>
    </Link>
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
