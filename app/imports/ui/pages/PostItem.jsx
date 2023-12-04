import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, NumField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Items } from '../../api/item/Items';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  title: String,
  image: { type: String, optional: true },
  description: { type: String, optional: true },
  quantity: { type: SimpleSchema.Integer, defaultValue: 1, min: 1 },
  condition: { type: String, allowedValues: ['Poor', 'Acceptable', 'Good', 'Excellent'] },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const PostItem = () => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { title, image, description, quantity, condition } = data;
    const owner = Meteor.user().username;
    const createdAt = new Date().toISOString();
    Items.collection.insert(
      { title, image, description, quantity, condition, owner, createdAt },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      },
    );
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container id="post-item-page" className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Post Item</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <TextField id="post-item-form-name" name="title" />
                <TextField id="post-item-form-image" name="image" />
                <LongTextField id="post-item-form-description" name="description" />
                <NumField id="post-item-form-quantity" name="quantity" decimal={false} />
                <SelectField id="post-item-form-condition" name="condition" />
                <SubmitField id="post-item-form-submit" value="Post" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default PostItem;
