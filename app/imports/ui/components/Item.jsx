import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { FlagFill, PencilSquare, PlusCircle } from 'react-bootstrap-icons';
import { Col, Container, Image, Row } from 'react-bootstrap';
import DeleteItemButton from './DeleteItemButton';
import MiniProfile from './MiniProfile';
import GoBackButton from './GoBackButton';

/* Renders the EditContact page for editing a single item. */
const Item = ({ item, ownerProfile }) => (
  <Container id="view-item-page" className="py-3">
    <GoBackButton />
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
        <hr />
        <h6>Posted on: {item.createdAt.toLocaleDateString()}</h6>
      </Col>
    </Row>
    {Meteor.user().username === 'admin@foo.com' && item.owner !== Meteor.user().username ? (
      <Container className="d-flex justify-content-end">
        <Row><Col><Button variant="contained" startIcon={<PlusCircle />} id="btn1" href={`/request/${item._id}`}>Request To Borrow</Button> </Col>
          <Col><DeleteItemButton id="btn1" item={item} /></Col>
        </Row>
      </Container>
    ) : '' }
    {Meteor.user().username === 'admin@foo.com' && item.owner === Meteor.user().username ? (
      <Container className="d-flex justify-content-end">
        <Row>
          <Col className="px-1"><Button title="Edit" id="btn1" variant="contained" startIcon={<PencilSquare />} href={`/edit/${item._id}`}>Edit</Button></Col>
          <Col className="px-1"><Button title="View Requests" variant="contained" startIcon={<FlagFill />} id="btn1" href={`/requests?item=${item._id}`}>View Requests</Button></Col>
          <Col className="px-1"><DeleteItemButton id="btn1" item={item} /></Col>
        </Row>
      </Container>
    ) : '' }
    {Meteor.user().username !== 'admin@foo.com' && item.owner !== Meteor.user().username ? (
      <Container className="d-flex justify-content-end">
        <Row><Col><Button variant="contained" startIcon={<PlusCircle />} id="btn1" href={`/request/${item._id}`}>Request To Borrow</Button> </Col>
        </Row>
      </Container>
    ) : ''}
    {Meteor.user().username !== 'admin@foo.com' && item.owner === Meteor.user().username ? (
      <Container className="d-flex justify-content-end">
        <Row>
          <Col className="px-1"><Button title="Edit" id="btn1" variant="contained" startIcon={<PencilSquare />} href={`/edit/${item._id}`}>Edit</Button></Col>
          <Col className="px-1"><Button title="View Requests" variant="contained" startIcon={<FlagFill />} id="btn1" href={`/requests?item=${item._id}`}>View Requests</Button></Col>
          <Col className="px-1"><DeleteItemButton item={item} /></Col>
        </Row>
      </Container>
    ) : '' }
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
    createdAt: PropTypes.instanceOf(Date),
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
