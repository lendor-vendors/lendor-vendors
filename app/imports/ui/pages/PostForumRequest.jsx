import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, NumField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { ForumRequests } from '../../api/forumRequest/ForumRequests';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  title: String,
  requestingQuantity: { type: SimpleSchema.Integer, defaultValue: 1, min: 1 },
  requestingCondition: { type: String, allowedValues: ['Poor', 'Acceptable', 'Good', 'Excellent'] },
  forumText: { type: String, optional: true },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const PostForumRequest = () => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { title, requestingQuantity, requestingCondition, forumText } = data;
    const poster = Meteor.user().username;
    ForumRequests.collection.insert(
      {
        title: title,
        poster: poster,
        requestingQuantity: requestingQuantity,
        requestingCondition: requestingCondition,
        forumText: forumText,
        status: 'unresolved',
      },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Forum request posted successfully', 'success');
          formRef.reset();
        }
      },
    );
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col className="text-center"><h2>Post Item</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <TextField id="post-forum-form-title" name="title" placeholder="Write a title" />
                <Row>
                  <Col>
                    <NumField id="post-forum-form-quantity" name="requestingQuantity" decimal={false} />
                  </Col>
                  <Col>
                    <SelectField id="post-forum-form-condition" name="requestingCondition" placeholder="Select a condition" />
                  </Col>
                </Row>
                <Row>
                  <LongTextField id="post-forum-form-description" name="forumText" placeholder="Describe what you are looking for" />
                  <SubmitField id="post-forum-form-submit" value="Post" />
                  <ErrorsField />
                </Row>
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default PostForumRequest;
