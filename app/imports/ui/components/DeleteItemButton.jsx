import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { removeItemMethod } from '../../startup/both/Methods';

const DeleteItemButton = ({ item }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        id="btn1"
        variant="danger"
        onClick={() => setShowModal(true)}
      >Delete Post
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>
            Are you sure you want to delete {item.title}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button
            href="/your_items"
            onClick={() => {
              Meteor.call(removeItemMethod, { itemId: item._id });
            }}
          >
            Yes
          </Button>
          <Button onClick={() => setShowModal(false)}>No</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DeleteItemButton.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    owner: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};
export default DeleteItemButton;
