import React from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';

/* Renders the EditContact page for editing a single document. */
const ViewItem = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditContact', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Items.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Items.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditContact', doc, ready);
  // On successful submit, insert the data.
  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Image src={doc.image} width={500} />
        </Col>
        <Col>
          <h1>{doc.title}</h1>
          <hr />
          <h6>Owner: {doc.name}</h6>
          <h6>Rating: </h6>
          <hr />
          <h6>Condition: {doc.condition}</h6>
          <h6>Quantity: {doc.quantity}</h6>
          <hr />
          <p>{doc.description}</p>
          <Link to={`/request/${doc._id}`}><Button id="button-addon1 button-text">Request To Borrow</Button></Link>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default ViewItem;
