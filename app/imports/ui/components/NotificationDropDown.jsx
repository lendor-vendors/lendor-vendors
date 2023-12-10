import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, ListGroup } from 'react-bootstrap';
import { BellFill } from 'react-bootstrap-icons';
import Notification from './Notification';

const NotificationDropDown = ({ notifications }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <Dropdown show={showDropdown} onToggle={handleToggleDropdown}>
      <Dropdown.Toggle id="notifications-icon-nav" className="secondary">
        <BellFill />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Header>Notifications</Dropdown.Header>
        <ListGroup>
          {notifications.map((notification) => (
            <ListGroup.Item key={notification._id}>
              <Notification notification={notification} />
            </ListGroup.Item>
          ))}
        </ListGroup>
        {notifications.length === 0 && <Dropdown.Item>No unread notifications</Dropdown.Item>}
        <Dropdown.Divider />
        <Dropdown.Item href="/notifications">View All Notifications</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

NotificationDropDown.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      read: PropTypes.bool.isRequired,
      itemId: PropTypes.string,
    }),
  ).isRequired,
};

export default NotificationDropDown;
