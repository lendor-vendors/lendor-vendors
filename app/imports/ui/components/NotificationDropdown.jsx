import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, NavDropdown } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { BellFill } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';

const NotificationDropdown = ({ notification }) => {
  const { _id, from, message, read } = notification;
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

  return (
    <NavDropdown id="notifications-icon-nav" title={<BellFill />}>
      <NavDropdown.ItemText className="dropdown-header">Recent Notifications</NavDropdown.ItemText>
      <NavDropdown className="dropdown-divider" />
      {unreadNotifications.length > 0 ? (
        unreadNotifications.map((notification) => (
          <NavDropdown.ItemText className="dropdown-header" key={notification._id}>
            New {notification.message}
          </NavDropdown.ItemText>
        ))
      ) : (
        <NavDropdown.ItemText className="dropdown-header">No unread notifications</NavDropdown.ItemText>
      )}
      <NavDropdown className="dropdown-divider" />
      <NavDropdown.ItemText as={NavLink} to="/notifications" className="dropdown-header">View all Notifications</NavDropdown.ItemText>
    </NavDropdown>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    read: PropTypes.bool.isRequired,
  }).isRequired,
};

export default NotificationDropdown;
