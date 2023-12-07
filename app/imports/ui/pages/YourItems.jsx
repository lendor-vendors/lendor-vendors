import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';
import ItemsList from '../components/ItemsList';
import PostItemForm from '../components/PostItemForm';

/* Renders a table containing all of the ItemCard documents. Use <ItemCard> to render each row. */
const YourItems = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, items } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Item documents.
    const subscription = Meteor.subscribe(Items.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Item documents
    const theItems = Items.collection.find({}).fetch();
    return {
      items: theItems,
      ready: rdy,
    };
  }, []);
  const [postModalShow, setPostModalShow] = useState(false);
  return (ready ? (
    <Container id="your-items-page" className="py-3">
      <Row className="d-flex">
        <Col />
        <Col md={7} className="text-center">
          <h2>Your Items</h2>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => setPostModalShow(true)}>Post an item</Button>
          <Modal
            show={postModalShow}
            onHide={() => setPostModalShow(false)}
          >
            <Card>
              <Card.Body>
                <Col className="text-center"><h2>Post Item</h2></Col>
                <PostItemForm />
              </Card.Body>
            </Card>
          </Modal>
        </Col>
        <ItemsList items={items} />
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default YourItems;
