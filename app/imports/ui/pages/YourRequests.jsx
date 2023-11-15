import React from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import NotFound from './NotFound';

/* Renders the EditStuff page for editing a single document. */
const YourRequests = () => {
  const { requests, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const itemSubscription = Meteor.subscribe(Items.adminPublicationName);
    const requestsSubscription = Meteor.subscribe(Requests.thisUserPublicationName);
    // Determine if the subscription is ready
    const rdy = itemSubscription.ready() && requestsSubscription.ready();
    // Get the document
    const foundRequests = Requests.collection.find().fetch();
    const requestedItemsIds = foundRequests.map(request => request.itemId);
    const foundItems = Items.collection.find({ _id: { $in: requestedItemsIds } });
    return {
      items: foundItems,
      requests: foundRequests,
      ready: rdy,
    };
  }, []);
  if (ready) {
    let numRequests = 0;
    const requestsList = (
      <ListGroup>
        {requests.map((request) => {
          numRequests++;
          return (
            <ListGroup.Item key={request._id}>
              <Row className="align-items-center">
                <Col>
                  <Row><p className="text-start">From: {request.requester} (you)</p></Row>
                  <Row><p className="text-start">Quantity: {request.quantity}</p></Row>
                </Col>
                <Col><p className="text-end">Cancel</p></Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
    return (
      <Container className="py-3">
        <Row className="justify-content-center text-center"><h3>You have {numRequests} {numRequests === 1 ? 'request' : 'requests'}</h3></Row>
        <ListGroup className="justify-content-center">
          {requestsList}
        </ListGroup>
      </Container>
    );
  }
  return <LoadingSpinner />;
};

export default YourRequests;
