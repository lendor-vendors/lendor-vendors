import React from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, NumField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { Items } from '../../api/item/Items';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from './NotFound';

const bridge = new SimpleSchema2Bridge(Items.schema);

/* Renders the EditItem page for editing a single document. */
const EditItem = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditItem', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { item, ready } = useTracker(() => {
    // Get access to Item documents.
    const subscription = Meteor.subscribe(Items.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const foundItem = Items.collection.findOne(_id);
    return {
      item: foundItem,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditItem', doc, ready);
  // On successful submit, insert the data.
  const submit = (data) => {
    const { title, image, description, quantity, condition } = data;
    Items.collection.update(_id, { $set: { title, image, description, quantity, condition } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  };

  if (ready) {
    if (!item) {
      return <NotFound />;
    }
    return (
      <Container className="py-3">
        <Row className="justify-content-center">
          <Col>
            <Image className="img" src={item.image} width="500" />
          </Col>
          <Col xs={5}>
            <Col className="text-center"><h2>Edit {item.title}</h2></Col>
            <AutoForm schema={bridge} onSubmit={data => submit(data)} model={item}>
              <Card>
                <Card.Body>
                  <TextField name="title" />
                  <TextField name="image" />
                  <LongTextField name="description" />
                  <NumField name="quantity" decimal={false} />
                  <SelectField name="condition" />
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

export default EditItem;
