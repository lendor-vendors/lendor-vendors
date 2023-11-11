import React from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';

/* Renders the EditStuff page for editing a single document. */
const ViewRequests = () => {
// Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const { item, requests, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const itemSubscription = Meteor.subscribe(Items.userPublicationName);
    const requestsSubscription = Meteor.subscribe(Requests.userPublicationName);
    // Determine if the subscription is ready
    const rdy = itemSubscription.ready() && requestsSubscription.ready();
    // Get the document
    const foundItem = Items.collection.findOne({ _id: _id });
    const foundRequests = Requests.collection.find({ item: _id });
    return {
      item: foundItem,
      requests: foundRequests,
      ready: rdy,
    };
  }, [_id]);

  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <h3>Requests for your {item.title}</h3>
          <ListGroup>
            {requests.map((request) => <ListGroup.Item><p>From: {request.owner}, quantity: {request.quantity}</p></ListGroup.Item>)}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default ViewRequests;
