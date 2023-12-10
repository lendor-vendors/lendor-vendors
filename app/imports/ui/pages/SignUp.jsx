import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-mui';
import Form from 'react-bootstrap/Form';
import { Profiles } from '../../api/profile/Profiles';

const SignUp = ({ location }) => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  const schema = new SimpleSchema({
    name: String,
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  const submit = (doc) => {
    const { email, password, name } = doc;
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToRef(true);
      }
    });
    Profiles.collection.insert({
      name: name,
      rating: 5.0,
      email: email,
    });
  };

  const { from } = location?.state || { from: { pathname: '/home' } };
  if (redirectToReferer) {
    return <Navigate to={from} />;
  }

  return (
    <Container id="signup-page" className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Register an Account</h2>
          </Col>
          <AutoForm schema={bridge} onSubmit={(data) => submit(data)}>
            <Card>
              <Card.Body>
                <TextField id="signup-form-name" name="name" placeholder="Enter your name" className="mb-2" />
                <TextField id="signup-form-email" name="email" placeholder="E-mail address" className="mb-2" />
                <TextField id="signup-form-password" name="password" placeholder="Password" type="password" className="mb-2" />
                <ErrorsField />
                <Form.Text>
                  <h3>Terms of Service</h3>
                  <p>1. Listing and Borrowing:</p>
                  <p>Lenders are responsible for the legitimacy of the items they list. Borrowers must treat the borrowed item with care and return them in the condition they received it in. Any damage/loss should be reported.</p>
                  <p>2. Prohibited Content:</p>
                  <p>Lenders are prohibited from listing any prohibited items. Borrowers are also prohibited from doing any illegal or harmful acts with the borrowed item.</p>
                  <p>By registering for an account, you agree to abide by these terms. We have the right to suspend or terminate accounts that violate these terms.</p>
                </Form.Text>
                <SubmitField id="signup-form-submit" />
              </Card.Body>
            </Card>
          </AutoForm>

          <Alert id="hasAccount" variant="light">
            Already have an account? Login <Link to="/signin" className="text-white">here</Link>
          </Alert>

          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Registration was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

SignUp.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string,
  }),
};

SignUp.defaultProps = {
  location: { state: '' },
};

export default SignUp;
