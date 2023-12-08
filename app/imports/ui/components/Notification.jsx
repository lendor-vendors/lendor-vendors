import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const Notification = ({ notification }) => {
  const { _id, from, message, read, timestamp } = notification;
  const [isRead, setIsRead] = useState(read);

  const markAsRead = () => {
    if (!isRead) {
      // Update the notification's read status in the database
      Meteor.call('Notifications.markAsRead', { notificationId: _id });
      // Update the local state
      setIsRead(true);
    }
  };

  const getNotificationMessage = () => {
    switch (message) {
    case 'request':
      return `${from} has requested to borrow an item.`;
    case 'accept':
      return `${from} has accepted your request to borrow an item.`;
    case 'deny':
      return `${from} has denied your request to borrow an item.`;
    case 'delete':
      return 'An admin has deleted an item.';
    default:
      return 'Unknown notification type.';
    }
  };

  const formattedTimestamp = `${(new Date(timestamp)).toLocaleDateString()}, ${(new Date(timestamp)).toLocaleTimeString()}`;

  return (
    <Alert variant={isRead ? 'light' : 'success'}>
      <p>{formattedTimestamp}</p>
      <p>{getNotificationMessage()}</p>
      {!isRead && (
        <Button variant="success" size="md" onClick={markAsRead}>
          Mark as Read
        </Button>
      )}
    </Alert>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    read: PropTypes.bool.isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
};

export default Notification;
