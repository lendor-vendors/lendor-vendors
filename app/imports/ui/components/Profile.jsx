import React from 'react';
// import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Star } from 'react-bootstrap-icons';
import ProfileItems from './ProfileItems';

/* Renders the EditContact page for editing a single item. */
const Profile = ({ profile }) => (
  // console.log('EditContact', item, ready);
  // On successful submit, insert the data.
  <Container className="py-3">
    <Row className="justify-content-center">
      <Col>
        <Image className="profileImg" src={profile.image} width={450} />
      </Col>
      <Col className="ms-0">
        <h1 style={{ fontSize: '4.8rem' }}>{profile.name}</h1>
        <h1 className="pt-3"><Star className="pb-1" /> {profile.rating} </h1>
      </Col>
    </Row>
    <Row>
      <h2 className="pt-5">All Items</h2>
      <ProfileItems owner={profile.email} />
    </Row>
  </Container>
);
Profile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    email: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default Profile;
