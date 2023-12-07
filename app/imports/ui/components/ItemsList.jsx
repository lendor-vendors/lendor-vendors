import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import Fuse from 'fuse.js';
import ItemCard from './ItemCard';

const ItemsList = ({ items }) => {
  const fuseOptions = {
    shouldSort: true,
    keys: ['title', 'condition', 'quantity'],
    threshold: 0.3,
  };
  const fuse = new Fuse(items, fuseOptions);
  const [searchPattern, setSearchPattern] = useState('');
  const fuseSearch = fuse.search(searchPattern);
  return (
    <Container id="gallery-page" className="py-3">
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
            items.map((item, index) => <Col style={{ maxWidth: '250px' }} key={index}><ItemCard item={item} /></Col>)
          ) : (
            fuseSearch.map((searchedObj, index) => <Col style={{ maxWidth: '250px' }} key={index}><ItemCard item={searchedObj.item} /></Col>)
          )}
        </Row>
      </Row>
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
