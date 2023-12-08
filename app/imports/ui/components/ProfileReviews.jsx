import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import { Reviews } from '../../api/review/Reviews';
import Review from './Review';

/* Renders a table containing all of the Stuff documents. Use <Contact> to render each row. */
const ProfileReviews = ({ email }) => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, reviews } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const reviewsSubscription = Meteor.subscribe(Reviews.userPublicationName);
    // Determine if the subscription is ready
    const rdy = reviewsSubscription.ready();
    // Get the Stuff documents
    const userReviews = Reviews.collection.find({ reviewee: { $eq: email } }).fetch();
    return {
      reviews: userReviews,
      ready: rdy,
    };
  }, []);
  if (reviews.length !== 0) {
    return (ready ? (
      <Container>
        <hr />
        <h2 className="pt-4 pb-4">Reviews ({reviews.length})</h2>
        <Row className="justify-content-center">
          {reviews.map((review, index) => <Row key={index}><Review review={review} /></Row>)}
        </Row>
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
