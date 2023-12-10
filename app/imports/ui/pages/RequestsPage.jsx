import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Image, ListGroup, Row, Modal } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { useLocation } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import { Profiles } from '../../api/profile/Profiles';
import { acceptRequestMethod, cancelRequestMethod, denyRequestMethod } from '../../startup/both/Methods';
import Tabs from '../components/Tabs';

/* Renders the EditStuff page for editing a single document. */
const RequestsPage = () => {
  const currentUser = useTracker(() => Meteor.user());
  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', data: {} });
  const [currentTab, setCurrentTab] = useState('Requests you made');
  // const [filters, setFilters] = useState(['']);

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
  const elementRef = useRef(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const scrollToElementId = params.get('item');
  useEffect(() => {
    if (scrollToElementId) {
      setCurrentTab('Requests for your items');
      if (ready && elementRef.current) {
        elementRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [ready]);
  if (ready) {
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
    const handleAcceptConfirm = (toAcceptRequest, requestedItem, toDenyRequestIds) => {
      Meteor.call(
        acceptRequestMethod,
        {
          requestId: toAcceptRequest._id,
          requestQuantity: toAcceptRequest.quantity,
          itemId: requestedItem._id,
          itemQuantity: requestedItem.quantity,
          toDenyRequestIds: toDenyRequestIds,
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
    const handleDenyConfirm = (toDenyRequestId) => {
      Meteor.call(
        denyRequestMethod,
        { requestId: toDenyRequestId },
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
              Item: <a href={`/view_item/${requestedItem._id}`} id="plain-link" className="fst-italic d-inline">{requestedItem.title}</a><br />
              Owner: <a href={`/view_item/${requestedItem._id}`} id="plain-link" className="fst-italic d-inline">{requestedItemOwnerProfile.name}</a><br />
              Quantity: {fromRequest.quantity}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => handleCancelConfirm(fromRequest)} variant="success">Yes</Button>
              <Button onClick={() => setModalShow(false)} variant="danger">No</Button>
            </Modal.Footer>
          </Modal>
        );
      }
      if (type === 'accept') {
        const { toAcceptRequest, requestedItem, requesterProfile } = data;
        const toDenyRequests = allToRequests.filter((toRequest) => (
          (toRequest.status === 'pending') &&
          (requestedItem.quantity - toAcceptRequest.quantity < toRequest.quantity) &&
          (toRequest._id !== toAcceptRequest._id)));
        const toDenyRequestIds = toDenyRequests.map((toDenyRequest) => toDenyRequest._id);
        return (
          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Are you sure you want to accept this request?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Item: <a href={`/view_item/${requestedItem._id}`} id="plain-link" className="fst-italic d-inline">{requestedItem.title}</a><br />
              Available quantity: {requestedItem.quantity}<br />
              Requester: <a href={`/view_profile/${requesterProfile._id}`} id="plain-link" className="fst-italic d-inline">{requesterProfile.name}</a><br />
              Requested quantity: {toAcceptRequest.quantity}
            </Modal.Body>
            {toDenyRequests.length > 0 ? (
              <Modal.Body>
                These requests will be automatically denied:<br />
                {toDenyRequests.map((toDenyRequest) => {
                  const toDenyRequesterProfile = Profiles.collection.findOne({ email: toDenyRequest.requester });
                  return (
                    <>
                      From: <a href={`/view_profile/${toDenyRequesterProfile._id}`} id="plain-link" className="fst-italic d-inline">{toDenyRequesterProfile.name}</a><br />
                      Quantity: {toDenyRequest.quantity}<br />
                      <div className="fst-italic">{toDenyRequest.requestedAt.toLocaleDateString()}</div>
                    </>
                  );
                })}
              </Modal.Body>
            ) : ''}
            <Modal.Footer>
              <Button onClick={() => handleAcceptConfirm(toAcceptRequest, requestedItem, toDenyRequestIds)} variant="success">Yes</Button>
              <Button onClick={() => setModalShow(false)} variant="danger">No</Button>
            </Modal.Footer>
          </Modal>
        );
      }
      if (type === 'deny') {
        const { toDenyRequest, requestedItem, requesterProfile } = data;
        return (
          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Are you sure you want to deny this request?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Item: <a href={`/view_item/${requestedItem._id}`} id="plain-link" className="fst-italic d-inline">{requestedItem.title}</a><br />
              Available quantity: {requestedItem.quantity}<br />
              Requester: <a href={`/view_item/${requestedItem._id}`} id="plain-link" className="fst-italic d-inline">{requesterProfile.name}</a><br />
              Quantity: {toDenyRequest.quantity}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => handleDenyConfirm(toDenyRequest._id)} variant="success">Yes</Button>
              <Button onClick={() => setModalShow(false)} variant="danger">No</Button>
            </Modal.Footer>
          </Modal>
        );
      }
      return '';
    };
    const toRequestItems = {};
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
              <ListGroup.Item style={{ height: '16rem', maxHeight: '16rem' }} key={requestedItemId} ref={requestedItemId === scrollToElementId ? elementRef : undefined}>
                <Row xs={2}>
                  <Col>
                    <Image src={requestedItem.image} style={{ width: '100%', minHeight: '15rem', maxHeight: '15rem', objectFit: 'cover', objectPosition: 'center' }} />
                  </Col>
                  <Col className="d-flex flex-column overflow-y-auto" style={{ maxHeight: '15rem' }}>
                    <h5>
                      <a href={`/view_item/${requestedItemId}`} id="plain-link">{requestedItem.title}</a><br />
                      Available: {requestedItem.quantity}
                    </h5>
                    {toRequests.map((toRequest) => {
                      const requesterProfile = Profiles.collection.findOne({ email: toRequest.requester });
                      return (
                        <div className="d-flex justify-content-between text-break" key={toRequest._id}>
                          <div>
                            <p>
                              From: <a href={`/view_profile/${requesterProfile._id}`} id="plain-link" className="fst-italic d-inline">{requesterProfile.name}</a><br />
                              Quantity: {toRequest.quantity}<br />
                              <div className="fst-italic">{toRequest.requestedAt.toLocaleDateString()}</div>
                            </p>
                          </div>
                          <div className="d-flex flex-column justify-content-center">
                            <div className="d-flex justify-content-end text-nowrap">
                              {// eslint-disable-next-line no-nested-ternary
                                toRequest.status === 'pending' ? (
                                  <>
                                    <Button
                                      className="me-1"
                                      size="sm"
                                      variant="success"
                                      onClick={() => handleButtonClick({ type: 'accept', data: { toAcceptRequest: toRequest, requestedItem, requesterProfile } })}
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="danger"
                                      onClick={() => handleButtonClick({ type: 'deny', data: { toDenyRequest: toRequest, requestedItem, requesterProfile } })}
                                    >
                                      Deny
                                    </Button>
                                  </>
                                  // eslint-disable-next-line no-nested-ternary
                                ) : <h6 className="fst-italic">{toRequest.status}</h6>
                              }
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
                    <h5>
                      <a href={`/view_item/${requestedItem._id}`} id="plain-link">{requestedItem.title}</a><br />
                      Available: {requestedItem.quantity}
                    </h5>
                    <p>
                      Owner: <a href={`/view_profile/${requestedItemOwnerProfile._id}`} id="plain-link" className="fst-italic d-inline">{requestedItemOwnerProfile.name}</a><br />
                      Requested quantity: {fromRequest.quantity}<br />
                      Requested on: <div className="fst-italic d-inline">{fromRequest.requestedAt.toLocaleDateString()}</div><br />
                      Status: <h6 className="fst-italic d-inline">{fromRequest.status}</h6>
                    </p>
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
                initialTab={currentTab}
                sendCurrentTab={receiveCurrentTab}
              />
            </Container>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <Container className="d-flex justify-content-center">
              {requestsList}
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
  return <LoadingSpinner />;
};

export default RequestsPage;
