import React, { useState } from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, NumField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { StarFill } from 'react-bootstrap-icons';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from './NotFound';
import { Profiles } from '../../api/profile/Profiles';

const bridge = new SimpleSchema2Bridge(Profiles.schema);

/* Renders the EditItem page for editing a single document. */
const ReviewForm = () => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
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
    const { ratings, review } = data;
    Profiles.collection.update(_id, { $set: { ratings, review } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  };

  if (ready) {
    if (!profile) {
      return <NotFound />;
    }
    return (
      <Container className="py-3">
        <Row className="justify-content-center">
          <Col xs={5}>
            <Col className="text-center"><h2>Rate {profile.name}</h2></Col>
            <AutoForm schema={bridge} onSubmit={data => submit(data)} model={profile}>
              <Card>
                <Card.Body>
                  Rate this user: <br /> {[...Array(5)].map((star, index) => {
                    const currentRating = index + 1;
                    return (
                      // eslint-disable-next-line jsx-a11y/label-has-associated-control
                      <label>
                        <input
                          type="radio"
                          name="rating"
                          value={currentRating}
                          onClick={() => setRating(currentRating)}
                        />
                        <StarFill
                          className="star"
                          size={30}
                          color={currentRating <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                          onMouseEnter={() => setHover(currentRating)}
                          onMouseLeave={() => setHover(null)}
                        />
                      </label>
                    );
                  })}
                  <TextField name="rating" />
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

export default ReviewForm;
