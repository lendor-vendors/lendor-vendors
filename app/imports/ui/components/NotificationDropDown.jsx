import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, ListGroup } from 'react-bootstrap';
import { BellFill } from 'react-bootstrap-icons';
import NotificationDropDownNotification from './NotificationDropDownNotification';

const NotificationDropDown = ({ notifications }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <Dropdown show={showDropdown} onToggle={handleToggleDropdown}>
      <Dropdown.Toggle style={{ background: 'transparent', border: 'none' }}>
        <BellFill />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Header style={{ color: 'black', fontSize: '16px' }}>Recent Notifications</Dropdown.Header>
        <Dropdown.Divider />
        <ListGroup>
          {notifications.map((notification) => (
            <ListGroup.Item key={notification._id}>
              <NotificationDropDownNotification notification={notification} />
            </ListGroup.Item>
          ))}
        </ListGroup>
        {notifications.length === 0 && <Dropdown.Header>No unread notifications</Dropdown.Header>}
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
