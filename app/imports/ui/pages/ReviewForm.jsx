import React, { useState } from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, LongTextField, HiddenField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { StarFill } from 'react-bootstrap-icons';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from './NotFound';
import { Profiles } from '../../api/profile/Profiles';
import { Reviews } from '../../api/review/Reviews';
import { insertReviewMethod } from '../../startup/both/Methods';

const bridge = new SimpleSchema2Bridge(Reviews.schema);

/* Renders the EditItem page for editing a single document. */
const ReviewForm = () => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditItem', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { review, profile, ready } = useTracker(() => {
    // Get access to Item documents.
    const subscription = Meteor.subscribe(Profiles.userPublicationName);
    const sub2 = Meteor.subscribe(Reviews.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready() && sub2.ready();
    // Get the document
    const foundProfile = Profiles.collection.findOne(_id);
    const reviewModel = Reviews.collection.findOne(_id);
    return {
      review: reviewModel,
      profile: foundProfile,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditItem', doc, ready);
  // On successful submit, insert the data.
  const submit = (data) => {
    const { comment } = data;
    const reviewee = Profiles.collection.findOne(_id);
    const reviewer = Meteor.user().username;
    const date = new Date();
    const reviewData = {
      reviewee: reviewee.name,
      reviewer: reviewer,
      rating: rating,
      comment: comment,
      timeStamp: date,
    };
    // Profiles.collection.update(_id, { $set: { reviewee, reviewer, rating, comment, date } }, (error) => (error ?
    //   swal('Error', error.message, 'error') :
    //   swal('Success', 'Item updated successfully', 'success')));
    //   Meteor.call(insertReviewMethod, { reviewee: reviewee }, { reviewer: reviewer }, { rating: rating }, { comment: comment }, { timeStamp: date });
    // };
    Meteor.call(insertReviewMethod, reviewData, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Review submitted successfully', 'success');
      }
    });
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
            <AutoForm schema={bridge} onSubmit={data => submit(data)} model={review}>
              <Card>
                <Card.Body>
                  Rate this user: <br /> {[...Array(5)].map((star, index) => {
                    const currentRating = index + 1;
                    return (
                      // eslint-disable-next-line jsx-a11y/label-has-associated-control
                      <label key={currentRating}>
                        <input
                          type="radio"
                          name="rating"
                          value={currentRating}
                          onClick={() => setRating(currentRating)}
                        />
                        <StarFill
                          className="star"
                          color={currentRating <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                          onMouseEnter={() => setHover(currentRating)}
                          onMouseLeave={() => setHover(null)}
                        />
                      </label>
                    );
                  })}
                  <LongTextField name="comment" />
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

export default ReviewForm;
