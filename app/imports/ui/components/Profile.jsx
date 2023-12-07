import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { Star } from 'react-bootstrap-icons';
import ProfileItems from './ProfileItems';
import ProfileReviews from './ProfileReviews';

/* Renders the EditContact page for editing a single item. */
const Profile = ({ profile }) => (
  // console.log('EditContact', item, ready);
  // On successful submit, insert the data.
  <Container id="view-profile-page" className="py-3">
    <Row>
      <Col xs={12} md={3} className="order-md-1">
        <Image className="profileImg pb-3 pt-3" src={profile.image ? profile.image : '/images/defaultPFP.png'} />
      </Col>
      <Col xs={12} md={9} className="order-md-2">
        <div>
          <h1 style={{ fontSize: '5rem' }}>{profile.name}</h1>
          <h1 style={{ fontSize: '2rem' }} className="pt-4"><Star className="pb-1" /> {profile.rating}</h1>
          <h1 className="pt-4">
            {profile.email !== Meteor.user().username ? (
              <Button style={{ marginLeft: '0em' }} href={`/review/${profile._id}`}>Leave a Review
              </Button>
            ) : (
              <Button style={{ marginLeft: '0em' }} id="review" href={`/editProfile/${profile._id}`}>Edit Profile
              </Button>
            )}
          </h1>
        </div>
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
    _id: PropTypes.string,
  }).isRequired,
};

export default Profile;
