import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import DeleteItemButton from './DeleteItemButton';
import MiniProfile from './MiniProfile';

/* Renders the EditContact page for editing a single item. */
const Item = ({ item, ownerProfile }) => (
  <Container className="py-3">
    <Row className="justify-content-center">
      <Col>
        <Image className="img" src={item.image} width={500} style={{ objectFit: 'cover' }} />
      </Col>
      <Col>
        <h1>{item.title}</h1>
        <hr />
        <MiniProfile profile={ownerProfile} />
        <hr />
        <h6>Condition: {item.condition}</h6>
        <h6>Quantity: {item.quantity}</h6>
        <hr />
        <h6>Description:</h6>
        <p>{item.description}</p>
      </Col>
    </Row>
    {item.owner !== Meteor.user().username ? (
      <Container>
        <Row className="float-end">
          <Col>
            <Button id="button-addon1 button-text" href={`/request/${item._id}`}>Request To Borrow</Button>
          </Col>
        </Row>
      </Container>
    ) : (
      <Container className="d-flex justify-content-end">
        <Row>
          <Col className="px-1"><Button id="btn1" href={`/edit/${item._id}`}>Edit</Button></Col>
          <Col className="px-1"><Button id="btn1" href={`/view_requests/${item._id}`}>View Requests</Button></Col>
          <Col className="px-1"><DeleteItemButton item={item} /></Col>
        </Row>
      </Container>
    )}
  </Container>
);

Item.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    owner: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  ownerProfile: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    contactInfo: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default Item;
