import React from 'react';
import PropTypes from 'prop-types';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Alert } from 'react-bootstrap';
import { Profiles } from '../../api/profile/Profiles';

const Notification = ({ notification }) => {
  const { from, message, data } = notification;
  const { fromProfile, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const profilesSubscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = profilesSubscription.ready();
    // Get the document
    const foundFromProfile = Profiles.collection.findOne({ email: from });
    return {
      fromProfile: foundFromProfile,
      ready: rdy,
    };
  }, []);
  const getNotificationMessage = () => {
    switch (message) {
    case 'request':
      return <><a href={`/view_profile/${fromProfile._id}`}>{fromProfile.name}</a> has requested to borrow your <a href={`/view_item/${data}`}>item.</a> Accept or deny this request <a href={`/requests?item=${data}`}>here.</a></>;
    case 'accept':
      return <><a href={`/view_profile/${fromProfile._id}`}>{fromProfile.name}</a> has accepted your request to borrow their <a href={`/view_item/${data}`}>item.</a> Contact them at: {fromProfile.contactInfo}</>;
    case 'deny':
      return <><a href={`/view_profile/${fromProfile._id}`}>{fromProfile.name}</a> has denied your request to borrow their <a href={`/view_item/${data}`}>item.</a></>;
    case 'delete':
      return 'An admin has deleted an item.';
    case 'fulfill':
      return <><a href={`/view_profile/${fromProfile._id}`}>{fromProfile.name}</a> has offered to fulfill your <a href={`view_forum_request/${data}`}>forum request.</a> Contact them at: {fromProfile.contactInfo}</>;
    default:
      return 'Unknown notification type.';
    }
  };

  return ready ? (
    <Alert variant="success">
      {getNotificationMessage()}
    </Alert>
  ) : '';
};

Notification.propTypes = {
  notification: PropTypes.shape({
    from: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    data: PropTypes.string,
  }).isRequired,
};

export default Notification;
