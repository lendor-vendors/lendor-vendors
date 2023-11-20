import React, { useState } from 'react';
import { Button, Col, Container, ListGroup, Row, Modal } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import ItemCard from '../components/ItemCard';
import { deleteRequestMethod } from '../../startup/both/Methods';

/* Renders the EditStuff page for editing a single document. */
const RequestsPage = () => {
  const currentUser = useTracker(() => Meteor.user());
  const [cancelConfirmShow, setCancelConfirmShow] = useState(false);
  const { allFromRequests, allToRequests, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const itemSubscription = Meteor.subscribe(Items.adminPublicationName);
    const fromRequestsSubscription = Meteor.subscribe(Requests.fromUserPublicationName);
    const toRequestsSubscription = Meteor.subscribe(Requests.toUserPublicationName);
    // Determine if the subscription is ready
    const rdy = itemSubscription.ready() && fromRequestsSubscription.ready() && toRequestsSubscription.ready();
    // Get the document
    const foundFromRequests = Requests.collection.find({ requester: currentUser?.username }).fetch();
    const foundToRequests = Requests.collection.find({ requester: { $not: currentUser?.username } }).fetch();
    return {
      allFromRequests: foundFromRequests,
      allToRequests: foundToRequests,
      ready: rdy,
    };
  }, []);
  if (ready) {
    const fromRequests = { pending: [], accepted: [], denied: [] };
    allFromRequests.forEach((fromRequest) => fromRequests[fromRequest.status].push(fromRequest));
    const toRequests = { pending: [], accepted: [], denied: [] };
    allToRequests.forEach((toRequest) => toRequests[toRequest.status].push(toRequest));
    const handleCancelConfirm = (fromRequest) => {
      Meteor.call(deleteRequestMethod, { requestId: fromRequest._id }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Cancelled request', 'success');
        }
      });
      setCancelConfirmShow(false);
    };
    const pendingFromRequestsList = (
      <ListGroup>
        {fromRequests.pending.map((request) => {
          const item = Items.collection.findOne({ _id: request.itemId });
          return (
            <ListGroup.Item key={request._id}>
              <Row>
                <Col>
                  <ItemCard item={item} />
                </Col>
                <Col>
                  <p>Owner: {item.owner}</p>
                  <Button onClick={() => setCancelConfirmShow(true)}>Cancel</Button>
                  <Modal
                    show={cancelConfirmShow}
                    onHide={() => setCancelConfirmShow(false)}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Are you sure you want to cancel your request?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Item: {item.title} <br />
                      Quantity: {request.quantity} <br />
                      Owner: {item.owner}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={() => handleCancelConfirm(request)}>Yes</Button>
                      <Button onClick={() => setCancelConfirmShow(false)}>No</Button>
                    </Modal.Footer>
                  </Modal>
                  {
                    // Requests.collection.remove({ _id: request._id });
                    // Meteor.call('Requests.remove', { requestId: request._id });
                  }
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
    // for each request to the user, map the request's requester to the request's itemId, and ensure that each itemId is only mapped once.
    const items = {};
    toRequests.pending.forEach((request) => {
      // eslint-disable-next-line no-prototype-builtins
      if (!items.hasOwnProperty(request.itemId)) {
        items[request.itemId] = [request.requester];
      } else {
        items[request.itemId].push(request.requester);
      }
    });
    // now, map each itemId to the itemCard and all its requesters. each itemCard should only appear once.
    const pendingToRequestsList = (
      <ListGroup>
        {Object.keys(items).map((itemId) => {
          const item = Items.collection.findOne({ _id: itemId });
          return (
            <ListGroup.Item key={itemId}>
              <Row>
                <Col>
                  <ItemCard item={item} />
                </Col>
                <Col>
                  {items[itemId].map((requester) => <p>{requester}</p>)}
                  <Button href={`/view_requests/${item._id}`}>View Requests</Button>
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
    return (
      <Container className="py-3">
        <Row className="justify-content-center text-center">
          <Col>
            <h3>Requests you made</h3>
            <ListGroup className="justify-content-center">
              {pendingFromRequestsList}
            </ListGroup>
          </Col>
          <Col>
            <h3>Requests for your items
            </h3>
            <ListGroup className="justify-content-center">
              {pendingToRequestsList}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
  return <LoadingSpinner />;
};

export default RequestsPage;
