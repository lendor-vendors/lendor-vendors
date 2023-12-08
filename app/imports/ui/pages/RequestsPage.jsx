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
import { cancelRequestMethod } from '../../startup/both/Methods';
import Tabs from '../components/Tabs';
import Item from '../components/Item';

/* Renders the EditStuff page for editing a single document. */
const RequestsPage = () => {
  const currentUser = useTracker(() => Meteor.user());
  const [cancelConfirmShow, setCancelConfirmShow] = useState(false);
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
      setCancelConfirmShow(false);
    };
    const receiveCurrentTab = (tab) => {
      setCurrentTab(tab);
    };

    // const fromRequestsList = (
    //   <>
    //     {fromRequests[fromRequestsTab].map((request) => {
    //       const item = Items.collection.findOne({ _id: request.itemId });
    //       const ownerProfile = Profiles.collection.findOne({ email: item.owner });
    //       return (
    //         <ListGroup.Item key={request._id}>
    //           <Row>
    //             <Col>
    //               <ItemCard item={item} />
    //             </Col>
    //             <Col>
    //               <p>
    //                 Owner: {ownerProfile.name} <br />
    //                 Rating: {ownerProfile.rating} <br />
    //               </p>
    //               <p>
    //                 Requested quantity: {request.quantity} <br />
    //                 Contact {ownerProfile.name} at: <br />
    //                 {ownerProfile.contactInfo}
    //               </p>
    //               {request.status === 'pending' ? (
    //                 <>
    //                   <Button onClick={() => setCancelConfirmShow(true)}>Cancel</Button>
    //                   <Modal
    //                     show={cancelConfirmShow}
    //                     onHide={() => setCancelConfirmShow(false)}
    //                   >
    //                     <Modal.Header closeButton>
    //                       <Modal.Title>Are you sure you want to cancel your request?</Modal.Title>
    //                     </Modal.Header>
    //                     <Modal.Body>
    //                       Item: {item.title} <br />
    //                       Quantity: {request.quantity} <br />
    //                       Owner: <Link to={`/view_profile/${ownerProfile._id}`}>{ownerProfile.name}</Link>
    //                     </Modal.Body>
    //                     <Modal.Footer>
    //                       <Button onClick={() => handleCancelConfirm(request)}>Yes</Button>
    //                       <Button onClick={() => setCancelConfirmShow(false)}>No</Button>
    //                     </Modal.Footer>
    //                   </Modal>
    //                 </>
    //               ) : ''}
    //             </Col>
    //           </Row>
    //         </ListGroup.Item>
    //       );
    //     })}
    //   </>
    // );
    // // for each request to the user, map the request's requester to the request's itemId, and ensure that each itemId is only mapped once.
    // const items = {};
    // toRequests[toRequestsTab].forEach((request) => {
    //   // eslint-disable-next-line no-prototype-builtins
    //   if (!items.hasOwnProperty(request.itemId)) {
    //     items[request.itemId] = [request.requester];
    //   } else {
    //     items[request.itemId].push(request.requester);
    //   }
    // });
    // // now, map each itemId to the itemCard and all its requesters. each itemCard should only appear once.
    // const toRequestsList = (
    //   <>
    //     {Object.keys(items).map((itemId) => {
    //       const item = Items.collection.findOne({ _id: itemId });
    //       return (
    //         <ListGroup.Item key={itemId}>
    //           <Row>
    //             <Col>
    //               <ItemCard item={item} />
    //             </Col>
    //             <Col>
    //               Requesters:
    //               {items[itemId].map((requester) => {
    //                 const requesterProfile = Profiles.collection.findOne({ email: requester });
    //                 return (
    //                   <p><Link to={`/view_profile/${requesterProfile._id}`}>{requesterProfile.name}</Link></p>
    //                 );
    //               })}
    //               <Button href={`/view_requests/${item._id}`}>View Requests</Button>
    //             </Col>
    //           </Row>
    //         </ListGroup.Item>
    //       );
    //     })}
    //   </>
    // );
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
    console.log(toRequestItems);
    const requestsList = (
      currentTab === 'Requests for your items' ? (
        <ListGroup style={{ width: '45rem' }}>
          {Object.keys(toRequestItems).map((requestedItemId) => {
            const requestedItem = Items.collection.findOne({ _id: requestedItemId });
            const toRequests = toRequestItems[requestedItemId];
            return (
              <ListGroup.Item style={{ height: '16rem', maxHeight: '16rem' }}>
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
                        <div className="d-flex justify-content-between">
                          <h6>
                            <a href={`/view_profile/${requesterProfile._id}`} id="plain-link">From: {requesterProfile.name}</a><br />
                            Quantity: {toRequest.quantity}
                          </h6>
                          <div className="text-end">
                            <Button className="me-1" size="sm" variant="success">Accept</Button>
                            <Button size="sm" variant="danger">Deny</Button>
                          </div>
                        </div>
                      );
                    })}
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      ) : (
        <ListGroup style={{ width: '45rem' }}>
          {allFromRequests.map((fromRequest) => {
            const requestedItem = Items.collection.findOne({ _id: fromRequest.itemId });
            const requestedItemOwnerProfile = Profiles.collection.findOne({ email: requestedItem.owner });
            return (
              <ListGroup.Item style={{ height: '16rem' }}>
                <Row xs={2}>
                  <Col>
                    <Image src={requestedItem.image} style={{ width: '100%', minHeight: '15rem', maxHeight: '15rem', objectFit: 'cover', objectPosition: 'center' }} />
                  </Col>
                  <Col className="d-flex flex-column">
                    <h5><a href={`/view_item/${requestedItem._id}`} id="plain-link">{requestedItem.title}</a></h5>
                    <h6><a href={`/view_profile/${requestedItemOwnerProfile._id}`} id="plain-link">Owner: {requestedItemOwnerProfile.name}</a></h6>
                    <h6>Requested quantity: {fromRequest.quantity}</h6>
                    <h6>Requested on: {new Date(fromRequest.requestedAt).toLocaleDateString()}</h6>
                    <h6>Status: {fromRequest.status}</h6>
                    {fromRequest.status === 'accepted' ? (
                      <h6 className="mt-auto text-break">Contact {requestedItemOwnerProfile.name} at: {requestedItemOwnerProfile.contactInfo}</h6>
                    ) : ''}
                    {fromRequest.status === 'pending' ? (
                      <div style={{ position: 'absolute', bottom: 5, right: 5 }}>
                        <Button onClick={() => setCancelConfirmShow(true)} variant="danger">Cancel</Button>
                        <Modal
                          show={cancelConfirmShow}
                          onHide={() => setCancelConfirmShow(false)}
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
                            <Button onClick={() => setCancelConfirmShow(false)}>No</Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    ) : ''}
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
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
          <Col>
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
