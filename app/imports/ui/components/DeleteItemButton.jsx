import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Modal } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { removeItemMethod } from '../../startup/both/Methods';

const DeleteItemButton = ({ item }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        id="btn1"
        title="Delete"
        color="error"
        variant="contained"
        startIcon={<Trash />}
        onClick={() => setShowModal(true)}
      >Delete Post
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>
            Are you sure you want to delete {item.title}? This will remove all requests for this item.
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button
            className="me-2"
            style={{ backgroundColor: '#198754' }}
            variant="contained"
            href="/your_items"
            title="Confirm"
            onClick={() => {
              Meteor.call(removeItemMethod, { toRemoveItemId: item._id });
            }}
          >
            Yes
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => setShowModal(false)}
          >
            No
          </Button>
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
