import React, { useState } from 'react';
import { Button, Col, Container, ListGroup, Modal, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import swal from 'sweetalert';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import { Profiles } from '../../api/profile/Profiles';
import NotFound from './NotFound';
import LoadingSpinner from '../components/LoadingSpinner';
import { acceptRequestMethod } from '../../startup/both/Methods';

/* Renders the EditStuff page for editing a single document. */
const ViewRequests = () => {
// Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const [acceptConfirmShow, setAcceptConfirmShow] = useState(false);
  const { item, requests, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const itemSubscription = Meteor.subscribe(Items.userPublicationName);
    const requestsSubscription = Meteor.subscribe(Requests.toUserPublicationName);
    const profilesSubscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = itemSubscription.ready() && requestsSubscription.ready() && profilesSubscription.ready();
    // Get the document
    const foundItem = Items.collection.findOne({ _id: _id });
    const foundRequests = Requests.collection.find({ itemId: _id }).fetch();
    return {
      item: foundItem,
      requests: foundRequests,
      ready: rdy,
    };
  }, [_id]);
  if (ready) {
    if (!item) {
      return <NotFound />;
    }
    const handleAcceptConfirm = (request) => {
      Meteor.call(
        acceptRequestMethod,
        { requestId: request._id, requestQuantity: request.quantity, itemId: item._id, itemQuantity: item.quantity },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Accepted request', 'success');
          }
        },
      );
      setAcceptConfirmShow(false);
    };
    let numRequests = 0;
    const pendingRequests = requests.filter(request => request.status === 'pending');
    const pendingRequestsList = (
      <ListGroup>
        {pendingRequests.map((request) => {
          numRequests++;
          return (
            <ListGroup.Item key={request._id}>
              <Row>
                <Col>
                  <Row><p className="text-start">From: {request.requester}</p></Row>
                  <Row><p className="text-start">Quantity: {request.quantity}</p></Row>
                </Col>
                <Col className="d-flex align-items-center">
                  <Container className="d-flex justify-content-end">
                    <Button className="me-3" onClick={() => setAcceptConfirmShow(true)}>Accept</Button>
                    <Modal
                      show={acceptConfirmShow}
                      onHide={() => setAcceptConfirmShow(false)}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Are you sure you want to accept this request?</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Item: {item.title} <br />
                        Quantity: {request.quantity} <br />
                        Requester: {request.requester}
                      </Modal.Body>
                      <Modal.Body>
                        {item.quantity - request.quantity === 0 ? `Your ${item.title} will have 0 quantity after accepting this request, so we will deny all other requests for you if you accept this request.` : ''}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button onClick={() => handleAcceptConfirm(request)}>Yes</Button>
                        <Button onClick={() => setAcceptConfirmShow(false)}>No</Button>
                      </Modal.Footer>
                    </Modal>
                    <Button>Deny</Button>
                  </Container>
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
    const acceptedRequests = requests.filter(request => request.status === 'accepted');
    const acceptedRequestsList = (
      <ListGroup>
        {acceptedRequests.map((request) => {
          numRequests++;
          const requesterProfile = Profiles.collection.findOne({ email: request.requester });
          return (
            <ListGroup.Item key={request._id}>
              <Row>
                <Col>
                  <Row><p className="text-start">From: {request.requester}</p></Row>
                  <Row><p className="text-start">Quantity: {request.quantity}</p></Row>
                </Col>
                <Col className="d-flex align-items-center">
                  <Container className="d-flex justify-content-end">
                    Requester contact info: {requesterProfile.contactInfo}
                  </Container>
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
    return (
      <Container className="py-3">
        <Row className="justify-content-center text-center"><h3>{numRequests} {numRequests === 1 ? 'request' : 'requests'} for your {item.title}</h3></Row>
        <Row>
          <Col>
            <h4 className="text-center">Pending requests:</h4>
            <ListGroup className="justify-content-center">
              {pendingRequestsList}
            </ListGroup>
          </Col>
          <Col>
            <h4 className="text-center">Accepted requests:</h4>
            <ListGroup>
              {acceptedRequestsList}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
  return <LoadingSpinner />;
};

export default ViewRequests;
