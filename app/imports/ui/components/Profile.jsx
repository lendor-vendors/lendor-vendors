import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { Star } from 'react-bootstrap-icons';
import ProfileItems from './ProfileItems';

/* Renders the EditContact page for editing a single item. */
const Profile = ({ profile }) => (
  // console.log('EditContact', item, ready);
  // On successful submit, insert the data.
  <Container id="view-profile-page" className="py-3">
    <Row className="justify-content-center">
      <Col xs={12} md={3}>
        <Image className="profileImg pb-3 pt-3" src={profile.image} />
      </Col>
      <Col xs={12} md={9}>
        <div className="pt-4">
          <h1 style={{ fontSize: '5rem' }}>{profile.name}
            {profile.email !== Meteor.user().username ? (
              <Button style={{ marginLeft: '15em' }} href={`/review/${profile._id}`}>Leave a Review
              </Button>
            ) : (
              <Button style={{ marginLeft: '20em' }} id="review" href={`/editProfile/${profile._id}`}>Edit Profile
              </Button>
            )}
          </h1>
          <h1 style={{ fontSize: '2.75rem' }} className="pt-4"><Star className="pb-1" /> {profile.rating} </h1>
        </div>
      </Col>
    </Row>
    <Row>
      <hr />
      <h2 className="pt-3">All Items</h2>
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
