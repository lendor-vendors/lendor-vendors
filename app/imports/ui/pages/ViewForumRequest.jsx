import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { Card, Col, Container, Image, Modal, Row } from 'react-bootstrap';
import { Button } from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import { Profiles } from '../../api/profile/Profiles';
import NotFound from './NotFound';
import { ForumRequests } from '../../api/forumRequest/ForumRequests';
import { resolveForumRequestMethod } from '../../startup/both/Methods';
import DeleteForumRequestButton from '../components/DeleteForumRequestButton';
import GoBackButton from '../components/GoBackButton';

const ViewForumRequest = () => {
  // Get the itemID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const currentUser = useTracker(() => Meteor.user());
  const [showModal, setShowModal] = useState(false);
  // console.log('EditContact', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { forumRequest, posterProfile, currentUserProfile, ready } = useTracker(() => {
    // Get access to Stuff items.
    const forumRequestsSubscription = Meteor.subscribe(ForumRequests.userPublicationName);
    const profilesSubscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = forumRequestsSubscription.ready() && profilesSubscription.ready();
    // Get the item
    const foundForumRequest = ForumRequests.collection.findOne(_id);
    const foundPosterProfile = Profiles.collection.findOne({ email: foundForumRequest?.poster });
    const foundCurrentUserProfile = Profiles.collection.findOne({ email: currentUser?.username });
    return {
      forumRequest: foundForumRequest,
      posterProfile: foundPosterProfile,
      currentUserProfile: foundCurrentUserProfile,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditContact', item, ready);
  // On successful submit, insert the data.
  if (ready) {
    if (forumRequest) {
      return (
        <Container className="py-3">
          <GoBackButton />
          <Row className="d-flex justify-content-center">
            <Col xs={10}>
              <Card>
                <Card.Header>
                  <Row>
                    <Col>
                      <Card.Title><h2 className="pb-1">{forumRequest.title}</h2></Card.Title>
                      <Card.Subtitle>
                        <h6>Status: {forumRequest.status}</h6>
                      </Card.Subtitle>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <Row>
                        <Link to={`/view_profile/${posterProfile._id}`} id="mini-profile" className="d-flex align-items-center">
                          <div className="d-inline-block">
                            <Image src={posterProfile.image ? posterProfile.image : '/images/defaultPFP.png'} roundedCircle width={60} />
                          </div>
                          <Container className="d-inline-block">
                            <h6>Poster: {posterProfile.name}</h6>
                            <h6>Posted On: {new Date(forumRequest.createdAt).toLocaleDateString()}</h6>
                          </Container>
                        </Link>
                      </Row>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body style={{ minHeight: '200px' }}>
                  <Card.Text>{forumRequest.forumText}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Row>
                    <Col className="d-flex align-items-center">
                      <div className="d-inline-block">
                        <h6>Requesting quantity: {forumRequest.requestingQuantity}</h6>
                        <h6>Requesting condition: {forumRequest.requestingCondition}</h6>
                      </div>
                    </Col>
                    <Col className="d-flex align-items-center">
                      <Container className="d-flex justify-content-end">
                        {(Roles.userIsInRole(Meteor.user(), 'admin')) || (currentUser?.username === forumRequest.poster) ? (
                          <DeleteForumRequestButton forumRequest={forumRequest} />
                        ) : ''}
                        {forumRequest.poster === currentUser?.username ? (
                          <Button className="ms-2" style={{ backgroundColor: '#198754' }} variant="contained" disabled={forumRequest.status === 'resolved'} onClick={() => setShowModal(true)}>Mark as resolved</Button>
                        ) : (
                          <Button style={{ backgroundColor: '#198754' }} variant="contained" disabled={forumRequest.status === 'resolved'} onClick={() => setShowModal(true)}>Fulfill</Button>
                        )}
                        <Modal
                          show={showModal}
                          onHide={() => setShowModal(false)}
                        >
                          {forumRequest.poster === currentUser?.username ? (
                            <>
                              <Modal.Header>
                                <Modal.Title>
                                  Are you sure you want to resolve this forum post?
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>You won&apos;t be able to set it back to &quot;unresolved&quot; after.</Modal.Body>
                              <Modal.Footer>
                                <Button
                                  className="me-2"
                                  style={{ backgroundColor: '#198754' }}
                                  variant="contained"
                                  onClick={() => {
                                    Meteor.call(resolveForumRequestMethod, { forumRequestId: forumRequest._id }, (error) => {
                                      if (error) {
                                        swal('Error', error.message, 'error');
                                      } else {
                                        swal('Success', 'Resolved forum request', 'success');
                                      }
                                    });
                                    setShowModal(false);
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button color="error" variant="contained" onClick={() => setShowModal(false)}>No</Button>
                              </Modal.Footer>
                            </>
                          ) : (
                            <>
                              <Modal.Header>
                                <Modal.Title>
                                  Are you sure you want to fulfill this request?
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <h6>
                                  Your contact info: <br />
                                  {currentUserProfile.contactInfo}
                                </h6>
                                Not correct? <a href={`/edit_profile/${currentUserProfile._id}`}>Edit your profile</a> to update your contact information.
                              </Modal.Body>
                              <Modal.Body>
                                By offering to fulfill this request, you agree to have your contact information be automatically sent to {posterProfile.name}.
                              </Modal.Body>
                              <Modal.Footer>
                                <Button className="me-2" style={{ backgroundColor: '#198754' }} variant="contained">Yes</Button>
                                <Button color="error" variant="contained" onClick={() => setShowModal(false)}>No</Button>
                              </Modal.Footer>
                            </>
                          )}
                        </Modal>
                      </Container>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
    return <NotFound />;
  }
  return <LoadingSpinner />;
};

export default ViewForumRequest;
