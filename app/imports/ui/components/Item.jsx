import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/** Renders a single row in the List item table. See pages/YourItems.jsx. */
const Item = ({ item }) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={item.image} width={200} height={150} />
    </Card.Header>
    <Card.Body>
      <Link id="item-cards" to={`/view_item/${item._id}`}><Card.Title>{item.title}</Card.Title></Link>
      <Card.Text>{item.description}</Card.Text>
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
