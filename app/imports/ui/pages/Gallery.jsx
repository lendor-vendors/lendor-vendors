import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import Fuse from 'fuse.js';
import Form from 'react-bootstrap/Form';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';
import ItemCard from '../components/ItemCard';

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
  const fuseOptions = {
    shouldSort: true,
    keys: ['title', 'condition', 'quantity'],
    threshold: 0.3,
  };
  const fuse = new Fuse(items, fuseOptions);
  const [searchPattern, setSearchPattern] = useState('');
  const fuseSearch = fuse.search(searchPattern);
  return (ready ? (
    <Container id="gallery-page" className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>Gallery</h2>
          </Col>
        </Col>
        <Container style={{ width: '50%' }}>
          <Form>
            <Form.Group>
              <Form.Control
                placeholder="Search for an item"
                onChange={(event) => {
                  setSearchPattern(event.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Container>
        <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="d-flex flex-wrap justify-content-center g-4 px-5">
          {searchPattern === '' ? (
            items.map((item, index) => <Col style={{ maxWidth: '250px' }} key={index}><ItemCard item={item} /></Col>)
          ) : (
            fuseSearch.map((searchedObj, index) => <Col style={{ maxWidth: '250px' }} key={index}><ItemCard item={searchedObj.item} /></Col>)
          )}
        </Row>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default Gallery;
