import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';
import PostItemForm from '../components/PostItemForm';
import ItemsList from '../components/ItemsList';

/* Renders a table containing all of the Stuff documents. Use <Contact> to render each row. */
const Gallery = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, items } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Item documents.
    const subscription = Meteor.subscribe(Items.adminPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Item documents
    const galleryItems = Items.collection.find({}).fetch();
    return {
      items: galleryItems,
      ready: rdy,
    };
  }, []);
  const [postModalShow, setPostModalShow] = useState(false);
  return (ready ? (
    <Container id="gallery-page" className="py-3">
      <Row className="d-flex">
        <Col />
        <Col md={7} className="text-center">
          <h2>Gallery</h2>
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

export default Gallery;
