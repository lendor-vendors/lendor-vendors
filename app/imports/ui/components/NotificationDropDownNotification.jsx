import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { Tracker } from 'meteor/tracker';
import { Profiles } from '../../api/profile/Profiles';

const Notification = ({ notification }) => {
  const { from, message, data } = notification;
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

  const getNotificationMessage = () => {
    switch (message) {
    case 'request':
      return (
        <div>
          New
          <span style={{ fontWeight: 'bold', color: 'blue' }}> request </span>
          {'from '}
          <Link to={`/view_profile/${userProfile._id}`} style={{ color: 'black', fontStyle: 'italic' }}>
            {username}
          </Link>
          <br />
          <Link to="/requests">View Request</Link>
        </div>
      );
    case 'accept':
      return (
        <div>
          <Link to={`/view_profile/${userProfile._id}`} style={{ color: 'black', fontStyle: 'italic' }}>
            {username}
          </Link>
          <span style={{ fontWeight: 'bold', color: 'green' }}> accepted </span>
          a request.
          <br />
          <Link to={`/view_item/${data}`}>View item</Link>
        </div>
      );
    case 'deny':
      return (
        <div>
          <Link to={`/view_profile/${userProfile._id}`} style={{ color: 'black', fontStyle: 'italic' }}>
            {username}
          </Link>
          <span style={{ fontWeight: 'bold', color: 'red' }}> denied </span>
          a request.
          <br />
          <Link to={`/view_item/${data}`}>View item</Link>
        </div>
      );
    case 'fulfill':
      return (
        <div>
          <Link to={`/view_profile/${userProfile._id}`} style={{ color: 'black', fontStyle: 'italic' }}>
            {username}
          </Link>
          {' Offered to '}
          <span style={{ fontWeight: 'bold', color: 'green' }}>fulfill</span>
          {' your forum request '}
        </div>
      );
    default:
      return 'Unknown notification type.';
    }
  };
  return getNotificationMessage();
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
