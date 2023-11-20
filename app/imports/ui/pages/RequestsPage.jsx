import React, { useState } from 'react';
import { Button, Col, Container, ListGroup, Row, Modal } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import ItemCard from '../components/ItemCard';

/* Renders the EditStuff page for editing a single document. */
const RequestsPage = () => {
  const currentUser = useTracker(() => Meteor.user());
  const [cancelConfirmShow, setCancelConfirmShow] = useState(false);
  const { fromRequests, toRequests, ready } = useTracker(() => {
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
      fromRequests: foundFromRequests,
      toRequests: foundToRequests,
      ready: rdy,
    };
  }, []);
  if (ready) {
    let numFromRequests = 0;
    const fromRequestsList = (
      <ListGroup>
        {fromRequests.map((request) => {
          numFromRequests++;
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
                  <Modal show={cancelConfirmShow} onHide={() => setCancelConfirmShow(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Are you sure you want to cancel your request?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Item: {item.title} <br />
                      Quantity: {request.quantity} <br />
                      Owner: {item.owner}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={() => {
                        Requests.collection.remove({ _id: request._id });
                        setCancelConfirmShow(false);
                        swal('Success', 'Cancelled request', 'success');
                      }}
                      >
                        Yes
                      </Button>
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
    const items = {};
    let numItems = 0;
    toRequests.forEach((request) => {
      // eslint-disable-next-line no-prototype-builtins
      if (items.hasOwnProperty(request.itemId)) {
        items[request.itemId].push(request.requester);
      } else {
        items[request.itemId] = [request.requester];
      }
    });
    const toRequestsList = (
      <ListGroup>
        {Object.keys(items).map((itemId) => {
          numItems++;
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
            <h3>You have made {numFromRequests} {numFromRequests === 1 ? 'request' : 'requests'}</h3>
            <ListGroup className="justify-content-center">
              {fromRequestsList}
            </ListGroup>
          </Col>
          <Col>
            <h3>{numItems} of your items have pending requests</h3>
            <ListGroup className="justify-content-center">
              {toRequestsList}
            </ListGroup>
          </Col>
        </Row>

      </Container>
    );
  }
  return <LoadingSpinner />;
};

export default RequestsPage;
