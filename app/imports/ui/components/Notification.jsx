import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { Tracker } from 'meteor/tracker';
import { Profiles } from '../../api/profile/Profiles';

const Notification = ({ notification }) => {
  const { _id, from, message, read, itemId } = notification;
  const [isRead, setIsRead] = useState(read);
  const [username, setUsername] = useState(from);
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const profileHandle = Meteor.subscribe(Profiles.userPublicationName);

    const trackerHandle = Tracker.autorun(() => {
      if (profileHandle.ready()) {
        const profile = Profiles.collection.findOne({ email: from });
        if (profile) {
          setUserProfile(profile);
          setUsername(profile.name);
        }
        console.log('profile:', profile);
      }
    });
    return () => {
      trackerHandle.stop();
    };
  }, [from]);

  const markAsRead = () => {
    if (!isRead) {
      Meteor.call('Notifications.markAsRead', { notificationId: _id, userId: Meteor.userId() }, (error) => {
        if (error) {
          console.error('Error marking notification as read:', error.reason);
        } else {
          setIsRead(true);
        }
      });
    }
  };

  const getNotificationMessage = () => {
    switch (message) {
    case 'request':
      return (
        <div>
          <Col>
            <Link to={`/view_profile/${userProfile._id}`} style={{ color: 'black', fontStyle: 'italic' }}>
              {username}
            </Link>
            {' has '}
            <span style={{ fontWeight: 'bold', color: 'blue' }}>requested</span>
            {' to borrow an item. '}
          </Col>
          <Link to="/requests">View Request</Link>
          <hr />
        </div>
      );
    case 'accept':
      return (
        <div>
          <Col>
            <Link to={`/view_profile/${userProfile._id}`} style={{ color: 'black', fontStyle: 'italic' }}>
              {username}
            </Link>
            {' has '}
            <span style={{ fontWeight: 'bold', color: 'green' }}>accepted</span>
            {' your request to borrow an item'}
          </Col>
          <Col><Link to={`/view_item/${itemId}`}>View item</Link></Col>
          <hr />
        </div>
      );
    case 'deny':
      return (
        <div>
          <Col>
            <Link to={`/view_profile/${userProfile._id}`} style={{ color: 'black', fontStyle: 'italic' }}>
              {username}
            </Link>
            {' has '}
            <span style={{ fontWeight: 'bold', color: 'red' }}>denied</span>
            {' your request to borrow an item.'}
          </Col>
          <Col><Link to={`/view_item/${itemId}`}>View item</Link></Col>
          <hr />
        </div>
      );
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
