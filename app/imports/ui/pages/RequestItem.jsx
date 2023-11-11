import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, NumField, SubmitField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import LoadingSpinner from '../components/LoadingSpinner';
import StuffItem from '../components/StuffItem';
import { Stuffs } from '../../api/stuff/Stuff';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  quantity: Number,
});

const bridge = new SimpleSchema2Bridge(formSchema);

const RequestItem = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const { item, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Items.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const foundItem = Items.collection.findOne({ _id: _id });
    return {
      item: foundItem,
      ready: rdy,
    };
  }, [_id]);
  // On submit, insert the data.
  const submit = (data) => {
    const { quantity } = data;
    const owner = Meteor.user().username;
    Requests.collection.insert(
      { item: _id, quantity, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item requested successfully', 'success');
          // TODO: Redirect back to item card view after submitting
        }
      },
    );
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Request {item.title}</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <NumField name="quantity" decimal={null} />
                <SubmitField value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default RequestItem;
