import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Modal } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { removeForumRequestMethod } from '../../startup/both/Methods';

const DeleteForumRequestButton = ({ forumRequest }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        id="btn1"
        variant="contained"
        color="error"
        onClick={() => setShowModal(true)}
      >Delete Post
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>
            Are you sure you want to delete this forum request?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button
            className="me-2"
            style={{ backgroundColor: '#198754' }}
            variant="contained"
            href="/forums"
            onClick={() => {
              Meteor.call(removeForumRequestMethod, { forumRequestId: forumRequest._id });
            }}
          >
            Yes
          </Button>
          <Button color="error" variant="contained" onClick={() => setShowModal(false)}>No</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DeleteForumRequestButton.propTypes = {
  forumRequest: PropTypes.shape({
    title: PropTypes.string,
    poster: PropTypes.string,
    requestingQuantity: PropTypes.number,
    requestingCondition: PropTypes.string,
    forumText: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};
export default DeleteForumRequestButton;
