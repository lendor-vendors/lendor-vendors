import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';

const Notification = ({ notification }) => {
  const { from, message } = notification;
  const {show, setShow} = useState(true);

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
    <Alert variant="success">
      {getNotificationMessage()}
    </Alert>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    from: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
};

export default Notification;
