import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Pagination } from '@mui/material';
import React, { useState } from 'react';
import Fuse from 'fuse.js';
import ItemCard from './ItemCard';

const ItemsList = ({ items }) => {
  // set up state variables for current page and cards per page for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(10);
  // calculate first and last index for Pagination to slice
  const lastIndex = currentPage * cardsPerPage;
  const firstIndex = lastIndex - cardsPerPage;
  // set up state variable for search pattern, default empty string
  const [searchPattern, setSearchPattern] = useState('');
  // get all items that are not owned by the current user
  const { theItems, allItems } = useTracker(() => {
    const currentUser = Meteor.user();
    const notOwnedItems = items.filter((item) => item.owner !== currentUser);
    // filter items based on search pattern
    const filteredItems = searchPattern
      ? new Fuse(notOwnedItems, { keys: ['title'], threshold: 0.3 }).search(searchPattern)
      : notOwnedItems;
    return {
      allItems: filteredItems,
      theItems: filteredItems.slice(firstIndex, lastIndex),
    };
  }, [currentPage, items, searchPattern]);
  // function to handle when page changes
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // calculate total pages for Pagination
  const totalFilteredPages = Math.ceil(allItems.length / cardsPerPage);
  return (
    <Container className="py-3">
      <Row className="d-flex">
        <Container style={{ width: '40rem' }}>
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
        <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="d-flex flex-wrap g-4 px-5">
          {searchPattern === '' ? (
            theItems.map((item, index) => <Col style={{ maxWidth: '250px' }} key={index}><ItemCard item={item} /></Col>)
          ) : (
            theItems.map((searchedObj, index) => <Col style={{ maxWidth: '250px' }} key={index}><ItemCard item={searchedObj.item} /></Col>)
          )}
        </Row>
      </Row>
      <Container className="d-flex justify-content-center">
        {/* Pagination component from Material UI */}
        <Pagination
          count={totalFilteredPages}
          page={currentPage}
          onChange={handlePageChange}
          color="standard"
          size="large"
          className="mt-3"
        />
      </Container>
    </Container>
  );
};

ItemsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    owner: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    _id: PropTypes.string,
  })).isRequired,
};

export default ItemsList;
