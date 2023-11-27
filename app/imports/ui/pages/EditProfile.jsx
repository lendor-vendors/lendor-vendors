import React from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { Profiles } from '../../api/profile/Profiles';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from './NotFound';

const bridge = new SimpleSchema2Bridge(Profiles.schema);

/* Renders the EditItem page for editing a single document. */
const EditProfile = () => {
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
    Profiles.collection.update(_id, { $set: { name, image, contactInfo, email } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Profile updated successfully', 'success')));
  };

  if (ready) {
    if (!profile) {
      return <NotFound />;
    }
    return (
      <Container className="py-3">
        <Row className="justify-content-center">
          <Col>
            <Image className="img" src={profile.image} width={500} style={{ objectFit: 'cover' }} />
          </Col>
          <Col>
            <Col className="text-center"><h2>Edit Your Profile</h2></Col>
            <AutoForm schema={bridge} onSubmit={data => submit(data)} model={profile}>
              <Card>
                <Card.Body>
                  <TextField name="name" />
                  <TextField name="image" />
                  <TextField name="contactInfo" />
                  <TextField name="email" />
                  <SubmitField value="Submit" />
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
