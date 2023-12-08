import React, { useState } from 'react';
import { Button, Col, Container, Image, ListGroup, Row, Modal } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import { Profiles } from '../../api/profile/Profiles';
import ItemCard from '../components/ItemCard';
import { acceptRequestMethod, cancelRequestMethod, denyRequestMethod } from '../../startup/both/Methods';
import Tabs from '../components/Tabs';
import Item from '../components/Item';

/* Renders the EditStuff page for editing a single document. */
const RequestsPage = () => {
  const currentUser = useTracker(() => Meteor.user());
  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', data: {} });
  const [fromRequestsTab, setFromRequestsTab] = useState('pending');
  const [toRequestsTab, setToRequestsTab] = useState('pending');

  const [currentTab, setCurrentTab] = useState('Requests you made');
  const [filters, setFilters] = useState(['']);

  const { allFromRequests, allToRequests, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const itemSubscription = Meteor.subscribe(Items.adminPublicationName);
    const fromRequestsSubscription = Meteor.subscribe(Requests.fromUserPublicationName);
    const toRequestsSubscription = Meteor.subscribe(Requests.toUserPublicationName);
    const profilesSubscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = itemSubscription.ready() && fromRequestsSubscription.ready() && toRequestsSubscription.ready() && profilesSubscription.ready();
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
    const currentUserProfile = Profiles.collection.findOne({ email: currentUser?.username });
    // const fromRequests = { pending: [], accepted: [], denied: [] };
    // allFromRequests.forEach((fromRequest) => fromRequests[fromRequest.status].push(fromRequest));
    // const toRequests = { pending: [], accepted: [], denied: [] };
    // allToRequests.forEach((toRequest) => toRequests[toRequest.status].push(toRequest));
    const handleCancelConfirm = (fromRequest) => {
      Meteor.call(cancelRequestMethod, { requestId: fromRequest._id }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Cancelled request', 'success');
        }
      });
      setModalShow(false);
    };
    const handleButtonClick = ({ type, data }) => {
      setModalShow(true);
      setModalContent({ type, data });
    };
    const handleAcceptConfirm = (item, request, toDenyRequests) => {
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
      setModalShow(false);
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
      setModalShow(false);
    };
    const receiveCurrentTab = (tab) => {
      setCurrentTab(tab);
    };
    const currentModal = () => {
      const { type, data } = modalContent;
      if (type === 'cancel') {
        const { fromRequest, requestedItem, requestedItemOwnerProfile } = data;
        return (
          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Are you sure you want to cancel your request?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Item: {requestedItem.title} <br />
              Quantity: {fromRequest.quantity} <br />
              Owner: <Link to={`/view_profile/${requestedItemOwnerProfile._id}`}>{requestedItemOwnerProfile.name}</Link>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => handleCancelConfirm(fromRequest)}>Yes</Button>
              <Button onClick={() => setModalShow(false)}>No</Button>
            </Modal.Footer>
          </Modal>
        );
      }
      if (type === 'accept') {
        return (
          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Are you sure you want to accept this request?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              something
            </Modal.Body>
            <Modal.Footer>
              <Button>Yes</Button>
              <Button onClick={() => setModalShow(false)}>No</Button>
            </Modal.Footer>
          </Modal>
        );
      }
      if (type === 'deny') {
        return (
          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Are you sure you want to deny this request?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button>Yes</Button>
              <Button onClick={() => setModalShow(false)}>No</Button>
            </Modal.Footer>
          </Modal>
        );
      }
      return '';
    };
    const toRequestItems = {};
    // loop through toRequests. for each toRequest, map to its itemId in an object. In the mapping, map the itemId to an array containing each toRequest for it.
    allToRequests.forEach((toRequest) => {
      // eslint-disable-next-line no-prototype-builtins
      if (!toRequestItems.hasOwnProperty(toRequest.itemId)) {
        toRequestItems[toRequest.itemId] = [toRequest];
      } else {
        toRequestItems[toRequest.itemId].push(toRequest);
      }
    });
    const requestsList = (
      currentTab === 'Requests for your items' ? (
        <ListGroup style={{ width: '45rem' }}>
          {Object.keys(toRequestItems).map((requestedItemId) => {
            const requestedItem = Items.collection.findOne({ _id: requestedItemId });
            const toRequests = toRequestItems[requestedItemId];
            return (
              <ListGroup.Item style={{ height: '16rem', maxHeight: '16rem' }} key={requestedItemId}>
                <Row xs={2}>
                  <Col>
                    <Image src={requestedItem.image} style={{ width: '100%', minHeight: '15rem', maxHeight: '15rem', objectFit: 'cover', objectPosition: 'center' }} />
                  </Col>
                  <Col className="d-flex flex-column overflow-y-auto" style={{ maxHeight: '15rem' }}>
                    <h5>
                      Requests for your: <br />
                      <a href={`/view_item/${requestedItemId}`} id="plain-link">{requestedItem.title}</a>
                    </h5>
                    {toRequests.map((toRequest) => {
                      const requesterProfile = Profiles.collection.findOne({ email: toRequest.requester });
                      return (
                        <div className="d-flex justify-content-between text-break" key={toRequest._id}>
                          <h6>
                            <a href={`/view_profile/${requesterProfile._id}`} id="plain-link">From:<br />
                              {requesterProfile.name}
                            </a>
                            <br />
                            Quantity: {toRequest.quantity}
                          </h6>
                          <div className="d-flex flex-column justify-content-center">
                            <div className="d-flex justify-content-end text-nowrap">
                              <Button
                                className="me-1"
                                size="sm"
                                variant="success"
                                onClick={() => handleButtonClick({ type: 'accept', data: { toRequest } })}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleButtonClick({ type: 'deny', data: { toRequest } })}
                              >
                                Deny
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
          {currentModal()}
        </ListGroup>
      ) : (
        <ListGroup style={{ width: '45rem' }}>
          {allFromRequests.map((fromRequest) => {
            const requestedItem = Items.collection.findOne({ _id: fromRequest.itemId });
            const requestedItemOwnerProfile = Profiles.collection.findOne({ email: requestedItem.owner });
            return (
              <ListGroup.Item style={{ height: '16rem' }} key={fromRequest._id}>
                <Row xs={2}>
                  <Col>
                    <Image src={requestedItem.image} style={{ width: '100%', minHeight: '15rem', maxHeight: '15rem', objectFit: 'cover', objectPosition: 'center' }} />
                  </Col>
                  <Col className="d-flex flex-column">
                    <h5><a href={`/view_item/${requestedItem._id}`} id="plain-link">{requestedItem.title}</a></h5>
                    <h6><a href={`/view_profile/${requestedItemOwnerProfile._id}`} id="plain-link">Owner: {requestedItemOwnerProfile.name}</a></h6>
                    <h6>Requested quantity: {fromRequest.quantity}</h6>
                    <h6>Requested on: {fromRequest.requestedAt.toLocaleDateString()}</h6>
                    <h6>Status: {fromRequest.status}</h6>
                    {fromRequest.status === 'accepted' ? (
                      <h6 className="mt-auto text-break">Contact {requestedItemOwnerProfile.name} at: {requestedItemOwnerProfile.contactInfo}</h6>
                    ) : ''}
                    {fromRequest.status === 'pending' ? (
                      <div style={{ position: 'absolute', bottom: 5, right: 5 }}>
                        <Button onClick={() => handleButtonClick({ type: 'cancel', data: { fromRequest, requestedItem, requestedItemOwnerProfile } })} variant="danger">Cancel</Button>
                      </div>
                    ) : ''}
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
          {currentModal()}
        </ListGroup>
      )
    );
    return (
      <Container id="requests-page" className="py-3">
        <Row className="d-flex pb-3">
          <Col>
            <h2 className="text-center">Requests</h2>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col lg={7}>
            <Container style={{ maxWidth: '44rem' }}>
              <Tabs
                tabNames={['Requests you made', 'Requests for your items']}
                sendCurrentTab={receiveCurrentTab}
              />
            </Container>
          </Col>
        </Row>
        <hr />
        <Container className="d-flex justify-content-center">
          {requestsList}
        </Container>
      </Container>
    );
  }
  return <LoadingSpinner />;
};

export default RequestsPage;
