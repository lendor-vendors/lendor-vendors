import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row } from 'react-bootstrap';
import { Pagination } from '@mui/material';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import { Reviews } from '../../api/review/Reviews';
import Review from './Review';

/* Renders a table containing all of the Stuff documents. Use <Contact> to render each row. */
const ProfileReviews = ({ email }) => {
  // set up state variables for current page and cards per page for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(10);
  // calculate first and last index for Pagination to slice
  const lastIndex = currentPage * cardsPerPage;
  const firstIndex = lastIndex - cardsPerPage;
  // function to handle when page changes
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, reviews, displayedReviews } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const reviewsSubscription = Meteor.subscribe(Reviews.userPublicationName);
    // Determine if the subscription is ready
    const rdy = reviewsSubscription.ready();
    // Get the Stuff documents
    const userReviews = Reviews.collection.find({ reviewee: { $eq: email } }).fetch();
    // Determine how many reviews to display based on current page
    const displayedReviews2 = userReviews.slice(firstIndex, lastIndex);
    return {
      reviews: userReviews,
      displayedReviews: displayedReviews2,
      ready: rdy,
    };
  }, [currentPage]);
  if (reviews.length !== 0) {
    return (ready ? (
      <Container>
        <hr />
        <h2 className="pt-4 pb-4">Reviews ({reviews.length})</h2>
        <Row className="justify-content-center">
          {displayedReviews.map((review, index) => <Row key={index}><Review review={review} /></Row>)}
        </Row>
        <Pagination
          count={Math.ceil(reviews.length / cardsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="standard"
          size="large"
          className="mt-3"
        />
      </Container>
    ) : <LoadingSpinner />);
  }
  return (ready ? (
    <Container>
      <hr />
      <h2 className="pt-3 pb-4">Reviews ({reviews.length})</h2>
      <Row className="pb-3" />
      <hr />
    </Container>
  ) : <LoadingSpinner />);
};

ProfileReviews.propTypes = {
  email: PropTypes.string.isRequired,
};

export default ProfileReviews;
