import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListContacts.jsx. */
// Add a rating field on card later?
const ItemCard = ({ item }) => (
  <Link to={`/view_item/${item._id}`}>
    <Card className="h-100">
      <Card.Header>
        <Image src={item.image} width={200} height={150} />
      </Card.Header>
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
      </Card.Body>
    </Card>
  </Link>
);

// Require a document to be passed to this component.
ItemCard.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ItemCard;
