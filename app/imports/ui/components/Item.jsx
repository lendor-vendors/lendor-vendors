import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';

/** Renders a single row in the List item table. See pages/ListItem.jsx. */
const Item = ({ item }) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={item.image} width={150} height={150} />
      <Card.Title>{item.title}</Card.Title>
    </Card.Header>
    <Card.Body>
      <Card.Text>{item.description}</Card.Text>
      <Card.Link href={`/request/${item._id}`}>Edit</Card.Link>
    </Card.Body>
  </Card>
);

// Require a document to be passed to this component.
Item.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.number,
    description: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    _id: PropTypes.string,
    owner: PropTypes.string,
  }).isRequired,
};

export default Item;
