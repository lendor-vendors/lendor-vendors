import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { ForumRequests } from '../../api/forumRequest/ForumRequests';
import LoadingSpinner from '../components/LoadingSpinner';
import Tabs from '../components/Tabs';
import ForumCard from '../components/ForumCard';

const Forums = () => {
  const currentUser = useTracker(() => Meteor.user());
  const [postFilterTab, setPostFilterTab] = useState('All Forum Posts');
  const { forumRequests, userForumRequests, ready } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const forumRequestsSubscription = Meteor.subscribe(ForumRequests.userPublicationName);
    // Determine if the subscription is ready
    const rdy = forumRequestsSubscription.ready();
    // Get the Stuff documents
    const foundForumRequests = ForumRequests.collection.find().fetch();
    const foundUserForumRequests = ForumRequests.collection.find({ poster: currentUser?.username });
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
          <Button href="/post_forum_request">Post a request forum</Button>
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
      <Row xs={4} className="d-flex justify-content-center g-4">
        {postFilterTab === 'All Forum Posts' ? (
          forumRequests.map((forumRequest) => <Col><ForumCard forumRequest={forumRequest}>{forumRequest.title}</ForumCard></Col>)
        ) : (
          userForumRequests.map((userForumRequest) => <Col><ForumCard forumRequest={userForumRequest}>{userForumRequest.title}</ForumCard></Col>)
        )}
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default Forums;
