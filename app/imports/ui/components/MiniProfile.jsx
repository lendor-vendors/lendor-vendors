import { Container, Image } from 'react-bootstrap';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const MiniProfile = ({ profile }) => {
  const currentUser = useTracker(() => Meteor.user());
  return (
    <Link to={`/view_profile/${profile._id}`} id="mini-profile" className="d-flex align-items-center">
      <div className="d-inline-block">
        <Image src={profile.image ? profile.image : '/images/defaultPFP.png'} roundedCircle width={60} />
      </div>
      <Container className="d-inline-block">
        <h6>Owner: {profile.name} {profile.email === currentUser?.username ? '(you)' : ''}</h6>
        <h6>Rating: {profile.rating}</h6>
      </Container>
    </Link>
  );
};

MiniProfile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    contactInfo: PropTypes.string,
    email: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default MiniProfile;
