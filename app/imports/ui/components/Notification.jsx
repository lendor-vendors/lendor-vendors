import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ notification }) => {
  const { from, message, itemId } = notification;

  const getNotificationMessage = () => {
    switch (message) {
    case 'request':
      return `${from} has requested to borrow your item.`;
    case 'accept':
      return `${from} has accepted your request to borrow item with ID ${itemId}.`;
    case 'deny':
      return `${from} has denied your request to borrow item with ID ${itemId}.`;
    case 'delete':
      return `An admin has deleted your item with ID ${itemId}.`;
    default:
      return 'Unknown notification type.';
    }
  };

  return (
    <div>
      <p>{getNotificationMessage()}</p>
    </div>
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
