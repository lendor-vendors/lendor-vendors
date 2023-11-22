import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { deleteItemMethod } from '../../startup/both/Methods';

/* Renders the EditContact page for editing a single item. */
const Item = ({ item }) => (
  // console.log('EditContact', item, ready);
  // On successful submit, insert the data.
  <Container className="py-3">
    <Row className="justify-content-center">
      <Col>
        <Image className="img" src={item.image} width={500} />
      </Col>
      <Col>
        <h1>{item.title}</h1>
        <hr />
        <h6>Owner: {item.owner}</h6>
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
            <Button id="button-addon1 button-text" title="Request" href={`/request/${item._id}`}>Request To Borrow</Button>
          </Col>
        </Row>
      </Container>
    ) : (
      <Container className="d-flex justify-content-end">
        <Row>
          <Col className="px-1"><Button id="btn1" title="Edit" href={`/edit/${item._id}`}>Edit</Button></Col>
          <Col className="px-1"><Button id="btn1" title="View Requests" href={`/view_requests/${item._id}`}>View Requests</Button></Col>
          <Col className="px-1">
            <Button
              id="btn1"
              variant="danger"
              title="Delete"
              onClick={() => { Meteor.call(deleteItemMethod, { itemId: item._id }, (error) => { if (error) { swal('Error', error.message, 'error'); } else { swal('Success', 'Post Deleted', 'success'); } }); }}
            >Delete Post
            </Button>
          </Col>
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
};

export default Item;
