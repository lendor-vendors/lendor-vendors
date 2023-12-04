import React from 'react';
import PropTypes from 'prop-types';
import { BellFill } from 'react-bootstrap-icons';
import { NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const NotificationDropdown = ({ notifications }) => {
  const recentNotifications = notifications.slice(0, 3);

  return (
    <NavDropdown id="notifications-icon-nav" title={<BellFill />}>
      {recentNotifications.map((notification) => (
        <NavDropdown.Item key={notification._id} as="div">
          <p>{notification.from} - {notification.message}</p>
        </NavDropdown.Item>
      ))}
      <NavDropdown.Divider />
      <NavLink to="/notifications">
        <p className="text-center">View all Notifications</p>
      </NavLink>
    </NavDropdown>
  );
};

NotificationDropdown.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      read: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default NotificationDropdown;
