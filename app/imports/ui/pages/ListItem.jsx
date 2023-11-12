import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import Item from '../components/Item';
import { Items } from '../../api/item/Items';

/* Renders a table containing all of the Item documents. Use <Item> to render each row. */
const ListItem = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, items } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Item documents.
    const subscription = Meteor.subscribe(Items.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const theItems = Items.collection.find({}).fetch();
    return {
      items: theItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>List Items</h2>
          </Col>
          <Row xs={1} md={2} lg={3} className="g-4">
            {items.map((item, index) => <Col key={index}><Item item={item} /></Col>)}
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListItem;
