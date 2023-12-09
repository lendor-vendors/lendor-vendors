import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

const Notification = ({ notification }) => {
  const { _id, from, message, read, itemId } = notification;
  const [isRead, setIsRead] = useState(read);

  const markAsRead = () => {
    if (!isRead) {
      Meteor.call('Notifications.markAsRead', { notificationId: _id });
      setIsRead(true);
    }
  };

  const getNotificationMessage = () => {
    switch (message) {
    case 'request':
      return (
        <div>
          <Col>
            {`${from} has `}
            <span style={{ fontWeight: 'bold', color: 'blue' }}>requested</span>
            {' to borrow an item.'}
          </Col>
          <Link to={`/view_requests/${itemId}`}>View Request</Link>
          <hr />
        </div>
      );
    case 'accept':
      return (
        <div>
          <Col>
            {`${from} has `}
            <span style={{ fontWeight: 'bold', color: 'green' }}>accepted</span>
            {' your request to borrow an item.'}
          </Col>
          <Col><Link to={`/view_item/${itemId}`}>View item</Link></Col>
          <hr />
        </div>
      );
    case 'deny':
      return (
        <div>
          <Col>
            {`${from} has `}
            <span style={{ fontWeight: 'bold', color: 'red' }}>denied</span>
            {' your request to borrow an item.'}
          </Col>
          <Col><Link to={`/view_item/${itemId}`}>View item</Link></Col>
          <hr />
        </div>
      );
    case 'delete':
      return 'An admin has deleted an item.';
    default:
      return 'Unknown notification type.';
    }
  };

  return (
    <Alert variant={isRead ? 'light' : 'success'}>
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
    itemId: PropTypes.string,
  }).isRequired,
};

export default Notification;
