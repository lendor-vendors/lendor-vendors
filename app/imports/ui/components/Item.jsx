import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Image } from 'react-bootstrap';

/** Renders a single row in the List item table. See pages/YourItems.jsx. */
const Item = ({ item }) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={item.image} width={150} height={150} />
      <Card.Title>{item.title}</Card.Title>
    </Card.Header>
    <Card.Body>
      <Card.Text>{item.description}</Card.Text>
      <Card.Link href="/notauthorized">Edit</Card.Link>
      <Button href={`/view_requests/${item._id}`}>View Requests</Button>
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
