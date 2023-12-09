import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { PencilSquare, Star } from 'react-bootstrap-icons';
import ProfileItems from './ProfileItems';
import ProfileReviews from './ProfileReviews';

/* Renders the EditContact page for editing a single item. */
const Profile = ({ profile }) => (
  // console.log('EditContact', item, ready);
  // On successful submit, insert the data.
  <Container id="view-profile-page" className="py-3">
    <Row>
      <Col className="flex-grow-0">
        <Image className="profileImg pb-3 pt-3" src={profile.image ? profile.image : '/images/defaultPFP.png'} />
      </Col>
      <Col className="flex-grow-1 ps-4">
        <Row className="gy-4">
          <h1 style={{ fontSize: '5rem' }}>{profile.name}</h1>
          <h1 style={{ fontSize: '2rem' }}><Star className="pb-1" /> {profile.rating.toFixed(1)} </h1>
          <h1>
            {profile.email !== Meteor.user().username ? (
              <Button variant="contained" startIcon={<Star />} href={`/review/${profile._id}`}>Leave a Review</Button>
            ) : (
              <Button variant="contained" startIcon={<PencilSquare />} id="review" href={`/editProfile/${profile._id}`}>Edit Profile</Button>
            )}
          </h1>
        </Row>
      </Col>
    </Row>
    <Row>
      <ProfileItems owner={profile.email} />
      <ProfileReviews email={profile.email} />
    </Row>
  </Container>
);
Profile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    email: PropTypes.string,
    comment: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default Profile;
