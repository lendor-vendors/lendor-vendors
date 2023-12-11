import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { Tracker } from 'meteor/tracker';
import { Profiles } from '../../api/profile/Profiles';

const Notification = ({ notification }) => {
  const { _id, from, message, read, data } = notification;
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
            {' to borrow an '}
            <a href={`/view_item/${data}`} style={{ color: 'black', fontStyle: 'italic' }}>item.</a>
          </Col>
          <Link to={`/requests?item=${data}`}>View Request</Link>
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
            <h6 className="mt-auto text-break">Contact {username} at: {userProfile.contactInfo}</h6>
          </Col>
          <Col><Link to={`/view_item/${data}`}>View item</Link></Col>
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
          <Col><Link to={`/view_item/${data}`}>View item</Link></Col>
          <hr />
        </div>
      );
    case 'fulfill':
      return (
        <div>
          <Col>
            <Link to={`/view_profile/${userProfile._id}`} style={{ color: 'black', fontStyle: 'italic' }}>
              {username}
            </Link>
            {' has '}
            <span style={{ fontWeight: 'bold', color: 'green' }}>offered</span>
            {' to fulfill your '}
            <Link to={`/view_forum_request/${data}`} style={{ color: 'black', fontStyle: 'italic' }}>forum request.</Link>
          </Col>
          <Col>
            Contact {username} at: {userProfile.contactInfo}
          </Col>
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
    data: PropTypes.string.isRequired,
    read: PropTypes.bool.isRequired,
  }).isRequired,
};

export default Notification;
