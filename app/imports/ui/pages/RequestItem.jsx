import React from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, NumField, SubmitField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from './NotFound';
import { Profiles } from '../../api/profile/Profiles';

const RequestItem = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const { item, ownerProfile, requesterProfile, hasRequested, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const itemsSubscription = Meteor.subscribe(Items.adminPublicationName);
    const fromRequestsSubscription = Meteor.subscribe(Requests.fromUserPublicationName);
    const profilesSubscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = itemsSubscription.ready() && fromRequestsSubscription.ready() && profilesSubscription.ready();
    // Get the document
    const foundItem = Items.collection.findOne({ _id: _id });
    const foundOwnerProfile = Profiles.collection.findOne({ email: foundItem?.owner });
    const foundRequesterProfile = Profiles.collection.findOne({ email: Meteor.user()?.username });
    // If there exists a request from this user for this item, then they have requested this item already
    const foundHasRequested = Requests.collection.find({ itemId: _id, status: 'pending' }).fetch().length > 0;
    return {
      item: foundItem,
      ownerProfile: foundOwnerProfile,
      requesterProfile: foundRequesterProfile,
      hasRequested: foundHasRequested,
      ready: rdy,
    };
  }, [_id]);
  // On submit, insert the data.
  const submit = (data) => {
    const { quantity } = data;
    const requester = Meteor.user().username;
    Requests.collection.insert(
      { itemId: _id, quantity, requester },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item requested successfully', 'success');
        }
      },
    );
  };
  // Create a schema to specify the structure of the data to appear in the form.
  const formSchema = new SimpleSchema({
    quantity: { type: Number, min: 1, max: () => item.quantity, defaultValue: 1 },
  });
  const bridge = new SimpleSchema2Bridge(formSchema);
  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  if (ready) {
    if (!item) {
      return <NotFound />;
    }
    if (hasRequested) {
      return (
        <Container className="py-3 text-center">
          <h1>You have requested this item.</h1>
        </Container>
      );
    }
    return item.owner === Meteor.user().username ? (
      <Container className="py-3 text-center">
        <h1>You own this item.</h1>
      </Container>
    ) : (
      <Container className="py-3">
        <Row className="justify-content-center">
          <Col xs={4}>
            <Col className="text-center"><h2>Request {item.title}</h2></Col>
            <AutoForm schema={bridge} onSubmit={data => submit(data)}>
              <Card>
                {requesterProfile.contactInfo ? (
                  <>
                    <Card.Title>
                      <Container className="d-flex py-2 align-items-center">
                        <div className="d-inline-block">
                          <Image src={ownerProfile.image ? ownerProfile.image : '/images/defaultPFP.png'} roundedCircle width={75} />
                        </div>
                        <Container className="d-inline-block">
                          <h6>Owner: {ownerProfile.name}</h6>
                          <h6>Rating: {ownerProfile.rating}</h6>
                        </Container>
                      </Container>
                    </Card.Title>
                    <Card.Body>
                      <h6>
                        Your contact info: <br />
                        {requesterProfile.contactInfo}
                      </h6>
                      Not correct? <a href="#" >Edit your profile</a> to update your contact information.
                    </Card.Body>
                    <Card.Body>
                      By requesting this item, you agree to have your contact information be automatically sent to {ownerProfile.name} if they accept your request.
                    </Card.Body>
                    <Card.Body>
                      <NumField
                        name="quantity"
                        decimal={null}
                        min={1}
                        max={item.quantity}
                      />
                      <SubmitField value="Submit" />
                    </Card.Body>
                  </>
                ) : (
                  <Card.Body>
                    {
                      // TODO: link this anchor to EditProfile when it's done
                    }
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    You have no contact info! Please <a href="">edit your profile</a> and add your contact information before requesting an item.
                  </Card.Body>
                )}
                <ErrorsField />
              </Card>
            </AutoForm>
          </Col>
        </Row>
      </Container>
    );
  }
  return <LoadingSpinner />;
};

export default RequestItem;
