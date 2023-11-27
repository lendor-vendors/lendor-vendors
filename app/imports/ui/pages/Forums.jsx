import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { ForumRequests } from '../../api/forumRequest/ForumRequests';
import LoadingSpinner from '../components/LoadingSpinner';
import Tabs from '../components/Tabs';
import ForumCard from '../components/ForumCard';
import { Profiles } from '../../api/profile/Profiles';

const Forums = () => {
  const currentUser = useTracker(() => Meteor.user());
  const [postFilterTab, setPostFilterTab] = useState('All Forum Posts');
  const [currentFilter, setCurrentFilter] = useState('unresolved');
  const { forumRequests, userForumRequests, ready } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const forumRequestsSubscription = Meteor.subscribe(ForumRequests.userPublicationName);
    const profilesSubscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = forumRequestsSubscription.ready() && profilesSubscription.ready();
    // Get the Stuff documents
    const foundForumRequests = ForumRequests.collection.find().fetch();
    const foundUserForumRequests = ForumRequests.collection.find({ poster: currentUser?.username }).fetch();
    return {
      forumRequests: foundForumRequests,
      userForumRequests: foundUserForumRequests,
      ready: rdy,
    };
  }, []);
  const receiveCurrentTab = (currentTab) => {
    setPostFilterTab(currentTab);
  };
  return (ready ? (
    <Container className="py-3">
      <Row className="d-flex pb-3">
        <Col />
        <Col>
          <h2 className="text-center">Request Forums</h2>
        </Col>
        <Col className="text-end">
          <Button href="/post_forum_request" variant="success">Post a forum request</Button>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        <Col lg={7}>
          <Tabs
            tabNames={['All Forum Posts', 'Your Forum Posts']}
            sendCurrentTab={receiveCurrentTab}
          />
        </Col>
      </Row>
      <hr />
      <Row className="pb-3">
        <Col className="text-end">
          <Dropdown>
            <Dropdown.Toggle variant="success">{currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setCurrentFilter('unresolved')}>Unresolved</Dropdown.Item>
              <Dropdown.Item onClick={() => setCurrentFilter('resolved')}>Resolved</Dropdown.Item>
              <Dropdown.Item onClick={() => setCurrentFilter('all')}>All</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row xs={1} md={1} xl={2} className="d-flex g-4">
        {postFilterTab === 'All Forum Posts' ? (
          forumRequests.map((forumRequest, index) => {
            if (currentFilter === 'all' || forumRequest.status === currentFilter) {
              const posterProfile = Profiles.collection.findOne({ email: forumRequest.poster });
              return (
                <Col key={index}><ForumCard forumRequest={forumRequest} profile={posterProfile} currentUsername={currentUser?.username} /></Col>
              );
            }
            return '';
          })
        ) : (
          userForumRequests.map((userForumRequest, index) => {
            if (currentFilter === 'all' || userForumRequest.status === currentFilter) {
              const posterProfile = Profiles.collection.findOne({ email: userForumRequest.poster });
              return (
                <Col key={index}>
                  <ForumCard forumRequest={userForumRequest} profile={posterProfile} currentUsername={currentUser?.username} />
                </Col>
              );
            }
            return '';
          })
        )}
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default Forums;
