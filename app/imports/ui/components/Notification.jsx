import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

const Notification = ({ notification }) => {
  const { from, message, itemId } = notification;

  const getNotificationMessage = () => {
    switch (message) {
    case 'request':
      return `${from} has requested to borrow your item, ${itemId}.`;
    case 'accept':
      return `${from} has accepted your request to borrow item ${itemId}.`;
    case 'deny':
      return `${from} has denied your request to borrow item ${itemId}.`;
    case 'delete':
      return `An admin has deleted your item, ${itemId}.`;
    default:
      return 'Unknown notification type.';
    }
  };

  return (
    <Alert variant={message === 'accept' ? 'success' : 'danger'}>
      {getNotificationMessage()}
    </Alert>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    from: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    itemId: PropTypes.string,
  }).isRequired,
};

export default Notification;
