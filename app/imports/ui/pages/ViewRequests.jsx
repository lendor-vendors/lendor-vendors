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
import { acceptRequestMethod, denyRequestMethod } from '../../startup/both/Methods';
import { Link } from 'react-router-dom';

/* Renders the EditStuff page for editing a single document. */
const ViewRequests = () => {
// Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const [acceptConfirmShow, setAcceptConfirmShow] = useState(false);
  const [modalContent, setModalContent] = useState({ type: undefined, request: undefined });
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
    const pendingRequests = requests.filter(request => request.status === 'pending');
    const handleAcceptConfirm = (request, toDenyRequests) => {
      Meteor.call(
        acceptRequestMethod,
        {
          requestId: request._id,
          requestQuantity: request.quantity,
          itemId: item._id,
          itemQuantity: item.quantity,
          toDenyRequests: toDenyRequests,
        },
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
    const handleDenyConfirm = (request) => {
      Meteor.call(
        denyRequestMethod,
        { requestId: request._id },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Denied request', 'success');
          }
        },
      );
      setAcceptConfirmShow(false);
    };
    const handleAcceptDeny = ({ type, request }) => {
      setAcceptConfirmShow(true);
      setModalContent({ type: type, request: request });
    };
    const acceptDenyModal = () => {
      const { type, request } = modalContent;
      if (request) {
        const requesterProfile = Profiles.collection.findOne({ email: request.requester });
        if (type === 'accept') {
          const toDenyRequests = pendingRequests.filter(pendingRequest => (item.quantity - request.quantity < pendingRequest.quantity) && (request._id !== pendingRequest._id));
          return (
            <Modal
              show={acceptConfirmShow}
              onHide={() => setAcceptConfirmShow(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to accept this request?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                From: <Link to={`/view_profile/${requesterProfile._id}`}>{requesterProfile.name}</Link> <br />
                For your: {item.title} <br />
                Quantity: {request.quantity}
              </Modal.Body>
              <Modal.Body>
                Your new {item.title} quantity: {item.quantity - request.quantity}
              </Modal.Body>
              {toDenyRequests.length > 0 ? (
                <Modal.Body>
                  <h6>These requests will be automatically denied:</h6>
                  {toDenyRequests.map((toDenyRequest) => (
                    <p>
                      From: {toDenyRequest.requester}<br />
                      Quantity: {toDenyRequest.quantity}
                    </p>
                  ))}
                </Modal.Body>
              ) : ''}
              <Modal.Footer>
                <Button onClick={() => handleAcceptConfirm(request, toDenyRequests)}>Yes</Button>
                <Button onClick={() => setAcceptConfirmShow(false)}>No</Button>
              </Modal.Footer>
            </Modal>
          );
        }
        return (
          <Modal
            show={acceptConfirmShow}
            onHide={() => setAcceptConfirmShow(false)}
          >
            <Modal.Header>
              <Modal.Title>Are you sure you want to deny this request?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              From: <Link to={`/view_profile/${requesterProfile._id}`}>{requesterProfile.name}</Link> <br />
              For: Your {item.title} <br />
              Quantity: {request.quantity}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => handleDenyConfirm(request)}>Yes</Button>
              <Button onClick={() => setAcceptConfirmShow(false)}>No</Button>
            </Modal.Footer>
          </Modal>
        );
      }
      return '';
    };
    const pendingRequestsList = (
      <ListGroup>
        {pendingRequests.map((request) => {
          const requesterProfile = Profiles.collection.findOne({ email: request.requester });
          return (
            <ListGroup.Item key={request._id}>
              <Row>
                <Col>
                  <Row><p className="text-start">From: {requesterProfile.name}</p></Row>
                  <Row><p className="text-start">Quantity: {request.quantity}</p></Row>
                </Col>
                <Col className="d-flex align-items-center">
                  <Container className="d-flex justify-content-end">
                    <Button className="me-3" onClick={() => handleAcceptDeny({ type: 'accept', request: request })}>Accept</Button>
                    <Button onClick={() => handleAcceptDeny({ type: 'deny', request: request })}>Deny</Button>
                    {acceptDenyModal()}
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
          const requesterProfile = Profiles.collection.findOne({ email: request.requester });
          return (
            <ListGroup.Item key={request._id}>
              <Row>
                <Col>
                  <Row><p className="text-start">From: <Link to={`/view_profile/${requesterProfile._id}`}>{requesterProfile.name}</Link></p></Row>
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
        <Row className="justify-content-center text-center"><h3>Requests for your {item.title} (Quantity: {item.quantity})</h3></Row>
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
