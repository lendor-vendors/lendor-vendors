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
    const owner = Meteor.user().username;
    // Get access to Stuff documents.
    const itemSubscription = Meteor.subscribe(Items.userPublicationName);
    const requestsSubscription = Meteor.subscribe(Requests.userPublicationName);
    // Determine if the subscription is ready
    const rdy = itemSubscription.ready() && requestsSubscription.ready();
    // Get the document
    const foundRequests = Requests.collection.find({ owner: owner }).fetch();
    const foundItemIds = foundRequests.map(request => request.item);
    const foundItems = Items.collection.find({ _id: { $in: foundItemIds } });
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
                  <Row><p className="text-start">From: {request.owner}</p></Row>
                  <Row><p className="text-start">Quantity: {request.quantity}</p></Row>
                </Col>
                <Col><p className="text-end">Accept Deny</p></Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
    return (
      <Container className="py-3">
        <Row className="justify-content-center text-center"><h3>{numRequests} {numRequests === 1 ? 'request' : 'requests'} for your {item.title}</h3></Row>
        <ListGroup className="justify-content-center">
          {requestsList}
        </ListGroup>
      </Container>
    );
  }
  return <LoadingSpinner />;
};

export default YourRequests;
