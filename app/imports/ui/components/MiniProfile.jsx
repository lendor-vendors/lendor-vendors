import { Container, Image } from 'react-bootstrap';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

const MiniProfile = ({ profile }) => {
  const currentUser = useTracker(() => Meteor.user());
  return (
    <div className="d-flex align-items-center">
      <div className="d-inline-block">
        <Image src={profile.image ? profile.image : '/images/defaultPFP.png'} roundedCircle width={60} />
      </div>
      <Container className="d-inline-block">
        <h6>Owner: {profile.name} {profile.email === currentUser?.username ? '(you)' : ''}</h6>
        <h6>Rating: {profile.rating}</h6>
      </Container>
    </div>
  );
};

MiniProfile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    contactInfo: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default MiniProfile;
