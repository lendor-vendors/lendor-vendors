import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Star } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import { Profiles } from '../../api/profile/Profiles';
import LoadingSpinner from './LoadingSpinner';

/** Renders a single row in the List item table. See pages/YourItems.jsx. */
const Review = ({ review }) => {
  // Subscribe to collection to find profile that matches review.reviewer in order to get pfp to display
  const { ready, profile } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const profileSubscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = profileSubscription.ready();
    // Get the profile whose email matches the reviewer's
    const reviewerProfile = Profiles.collection.findOne({ email: { $eq: review.reviewer } });
    return {
      profile: reviewerProfile,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container>
      <div className="d-flex flex-row align-items-center pb-2">
        <Link to={`/view_profile/${profile._id}`} id="mini-profile">
          <div className="d-inline-block">
            <Image src={profile.image ? profile.image : '/images/defaultPFP.png'} roundedCircle width={60} />
          </div>
        </Link>
        <Link to={`/view_profile/${profile._id}`} id="mini-profile">
          <div className="d-inline-block container">
            <h6>{profile.name}</h6>
            <h6>Rating: <Star className="pb-1" /> {review.rating}</h6>
          </div>
        </Link>
      </div>
      <Row><p>{review.comment}</p></Row>
      <Row><h6>Reviewed on: {review.timeStamp.toLocaleDateString('en-US')}</h6></Row>
      <hr />
    </Container>
  ) : <LoadingSpinner />);
};

// Require a document to be passed to this component.
Review.propTypes = {
  review: PropTypes.shape({
    reviewer: PropTypes.string,
    rating: PropTypes.string,
    comment: PropTypes.string,
    timeStamp: PropTypes.instanceOf(Date),
  }).isRequired,
};

export default Review;
