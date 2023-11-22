import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import { Items } from '../../api/item/Items';
import ItemCard from './ItemCard';

/* Renders a table containing all of the Stuff documents. Use <Contact> to render each row. */
const ProfileItems = ({ owner }) => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, items } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Items.adminPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const userItems = Items.collection.find({ owner: { $eq: owner } }).fetch();
    return {
      items: userItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Row xs={1} md={2} lg={5} className="g-3">
          {items.map((item, index) => <Col key={index}><ItemCard item={item} /></Col>)}
        </Row>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

ProfileItems.propTypes = {
  owner: PropTypes.string.isRequired,
};

export default ProfileItems;
