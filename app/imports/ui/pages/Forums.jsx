import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Pagination } from '@mui/material';
import { Button, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { ForumRequests } from '../../api/forumRequest/ForumRequests';
import LoadingSpinner from '../components/LoadingSpinner';
import Tabs from '../components/Tabs';
import ForumCard from '../components/ForumCard';
import { Profiles } from '../../api/profile/Profiles';

const Forums = () => {
  // get current user
  const currentUser = useTracker(() => Meteor.user());
  // set up state variables the filter dropdown, tabs, and current page/cardsPerPage for Pagination
  const [postFilterTab, setPostFilterTab] = useState('All Forum Posts');
  const [currentFilter, setCurrentFilter] = useState('unresolved');
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(6);
  // calculate first and last index for Pagination to slice
  const lastIndex = currentPage * cardsPerPage;
  const firstIndex = lastIndex - cardsPerPage;
  // set up filter options for dropdown
  const filterOptions = {
    unresolved: 'Unresolved',
    resolved: 'Resolved',
    all: 'All',
  };
  // function to handle when page changes
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // get forum requests and user forum requests
  const { forumRequests, userForumRequests, displayedForumRequests, displayedUserForumRequests, ready } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to ForumRequests and Profiles documents.
    const forumRequestsSubscription = Meteor.subscribe(ForumRequests.userPublicationName);
    const profilesSubscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscriptions are ready
    const rdy = forumRequestsSubscription.ready() && profilesSubscription.ready();
    // Get the ForumRequests and Profiles documents
    const foundForumRequests = ForumRequests.collection.find().fetch();
    const foundUserForumRequests = ForumRequests.collection.find({ poster: currentUser?.username }).fetch();
    // Determine which forum requests to display based on current page
    const displayedForumRequests2 = foundForumRequests.slice(firstIndex, lastIndex);
    const displayedUserForumRequests2 = foundUserForumRequests.slice(firstIndex, lastIndex);
    return {
      displayedForumRequests: displayedForumRequests2,
      forumRequests: foundForumRequests,
      userForumRequests: foundUserForumRequests,
      displayedUserForumRequests: displayedUserForumRequests2,
      ready: rdy,
    };
  }, [currentPage]);
  // Function to receive current tab from Tabs component
  const receiveCurrentTab = (currentTab) => {
    setPostFilterTab(currentTab);
  };
  // Effect to reset currentPage when postFilterTab or currentFilter dropdown changes
  useEffect(() => {
    setCurrentPage(1);
  }, [postFilterTab, currentFilter]);
  // Function to calculate item count based on filter
  const getItemCountForFilter = (filterKey) => {
    const targetArray = postFilterTab === 'All Forum Posts' ? forumRequests : userForumRequests;
    switch (filterKey) {
    case 'unresolved':
      return targetArray.filter((item) => item.status === 'unresolved').length;
    case 'resolved':
      return targetArray.filter((item) => item.status === 'resolved').length;
    case 'all':
      return targetArray.length;
    default:
      return 0;
    }
  };
  return (ready ? (
    <Container id="forums-page" className="py-3">
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
            currentTab={postFilterTab}
          />
        </Col>
      </Row>
      <hr />
      <Row className="pb-3">
        <Col className="text-end">
          <Dropdown>
            <Dropdown.Toggle variant="success">{currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}</Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.keys(filterOptions).map((filterKey) => (
                <Dropdown.Item
                  key={filterKey}
                  onClick={() => {
                    setCurrentFilter(filterKey);
                    setPostFilterTab(postFilterTab);
                  }}
                >
                  {filterOptions[filterKey]}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row xs={1} md={1} xl={2} className="d-flex g-4">
        {postFilterTab === 'All Forum Posts' ? (
          <>
            {displayedForumRequests.map((forumRequest, index) => {
              if (currentFilter === 'all' || forumRequest.status === currentFilter) {
                const posterProfile = Profiles.collection.findOne({ email: forumRequest.poster });
                return (
                  <Col key={index}><ForumCard forumRequest={forumRequest} profile={posterProfile} currentUsername={currentUser?.username} />
                  </Col>
                );
              }
              return null;
            }).filter((forumRequest) => forumRequest !== null)}
          </>
        ) : (
          <>
            {displayedUserForumRequests.map((userForumRequest, index) => {
              if (currentFilter === 'all' || userForumRequest.status === currentFilter) {
                const posterProfile = Profiles.collection.findOne({ email: userForumRequest.poster });
                return (
                  <Col key={index}>
                    <ForumCard forumRequest={userForumRequest} profile={posterProfile} currentUsername={currentUser?.username} />
                  </Col>
                );
              }
              return null;
            }).filter((userForumRequest) => userForumRequest !== null)}
          </>
        )}
      </Row>
      <Container className="mt-3 d-flex justify-content-center">
        {/* Pagination component from Material UI */}
        <Pagination
          count={Math.ceil(getItemCountForFilter(currentFilter) / cardsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="standard"
          size="large"
          className="mt-3"
        />
      </Container>
    </Container>
  ) : <LoadingSpinner />);
};

export default Forums;
