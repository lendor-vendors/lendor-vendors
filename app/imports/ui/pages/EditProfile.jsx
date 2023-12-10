import React, { useState } from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import SimpleSchema from 'simpl-schema';
import { updateProfileMethod } from '../../startup/both/Methods';
import { Profiles } from '../../api/profile/Profiles';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from './NotFound';
import ImageField from '../components/ImageField';

const editProfileSchema = new SimpleSchema({
  _id: String,
  name: String,
  image: { type: String, required: false },
  rating: Number,
  contactInfo: { type: String, required: false },
  email: {
    type: String,
    required: true,
    custom() {
      const email = this.value;
      const existingUser = Profiles.collection.findOne({ email });
      if (existingUser) {
        const currentUser = Meteor.users.find(Meteor.userId()).fetch()[0];
        if (currentUser.username !== email) {
          return 'takenEmail';
        }
      }
      return undefined;
    },
  },
}, {
  getErrorMessage(error) {
    if (error) {
      if (error.type === 'takenEmail') return 'This email is taken';
    }
    // Returning undefined will fall back to using defaults
    return undefined;
  },
});
const bridge = new SimpleSchema2Bridge(editProfileSchema);

/* Renders the EditItem page for editing a single document. */
const EditProfile = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditItem', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { profile, ready } = useTracker(() => {
    // Get access to Item documents.
    const subscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const foundProfile = Profiles.collection.findOne(_id);
    return {
      profile: foundProfile,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditItem', doc, ready);
  // On successful submit, insert the data.
  const submit = (data) => {
    const { name, image, contactInfo, email } = data;
    const oldEmail = profile.email;
    Meteor.call(updateProfileMethod, { profileId: _id, name, image: uploadedImage || image, contactInfo, email, oldEmail });
  };

  if (ready) {
    if (!profile) {
      return <NotFound />;
    }
    return (
      <Container id="edit-profile-page" className="py-3">
        <Row className="justify-content-center">
          <Col>
            <Image className="img" src={profile.image} width={500} style={{ objectFit: 'cover' }} />
          </Col>
          <Col>
            <Col className="text-center"><h2>Edit Your Profile</h2></Col>
            <AutoForm schema={bridge} onSubmit={data => submit(data)} model={profile}>
              <Card>
                <Card.Body>
                  <TextField id="edit-profile-name" name="name" />
                  <ImageField name="image" onChange={setUploadedImage} />
                  <TextField name="contactInfo" />
                  <TextField name="email" />
                  <SubmitField id="edit-profile-submit" value="Submit" />
                  <ErrorsField />
                </Card.Body>
              </Card>
            </AutoForm>
          </Col>
        </Row>
      </Container>
    );
  }
  return <LoadingSpinner />;
};

export default EditProfile;
