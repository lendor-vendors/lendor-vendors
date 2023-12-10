import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { Pagination } from '@mui/material';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import { Items } from '../../api/item/Items';
import ItemCard from './ItemCard';

/* Renders a table containing all of the Stuff documents. Use <Contact> to render each row. */
const ProfileItems = ({ owner }) => {
  // set up state variables for current page and cards per page for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(10);
  // calculate first and last index for Pagination to slice
  const lastIndex = currentPage * cardsPerPage;
  const firstIndex = lastIndex - cardsPerPage;
  // function to handle when page changes
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, items, displayedItems } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Items.adminPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const userItems = Items.collection.find({ owner: { $eq: owner } }).fetch();
    // Determine which items to display based on current page
    const displayedItems2 = userItems.slice(firstIndex, lastIndex);
    return {
      items: userItems,
      displayedItems: displayedItems2,
      ready: rdy,
    };
  }, [currentPage]);
  return (ready ? (
    <Container>
      <hr />
      <h2 className="pt-3">All Items ({items.length})</h2>
      <Row xs={1} md={2} lg={5} className="g-3 justify-content-start py-3">
        {displayedItems.map((item, index) => <Col key={index}><ItemCard item={item} /></Col>)}
      </Row>
      <Container className="d-flex justify-content-center">
        <Pagination
          count={Math.ceil(items.length / cardsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="standard"
          size="large"
          className="mt-3"
        />
      </Container>
    </Container>
  ) : <LoadingSpinner />);
};

ProfileItems.propTypes = {
  owner: PropTypes.string.isRequired,
};

export default ProfileItems;
