import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from './NotFound';
import { Profiles } from '../../api/profile/Profiles';
import { Items } from '../../api/item/Items';
import { Notifications } from '../../api/notification/Notifications';
import Notification from '../components/Notification'; // Import the Notification component

const ViewNotifications = () => {
  const { _id } = useParams();
  const { notifications, item, ready } = useTracker(() => {
    const itemsSubscription = Meteor.subscribe(Items.adminPublicationName);
    const profilesSubscription = Meteor.subscribe(Profiles.userPublicationName);
    const notificationsSubscription = Meteor.subscribe(Notifications.toUserPublicationName);
    const rdy = itemsSubscription.ready() && profilesSubscription.ready() && notificationsSubscription.ready();
    const foundItem = Items.collection.findOne(_id);
    const foundProfile = Profiles.collection.findOne({ email: foundItem?.owner });
    const foundNotifications = Notifications.collection.find({ to: Meteor.userId() }).fetch();
    return {
      notifications: foundNotifications,
      item: foundItem,
      ownerProfile: foundProfile,
      ready: rdy,
    };
  }, [_id]);

  if (ready) {
    if (item) {
      return (
        <div>
          <h2>Notifications</h2>
          {notifications.map((notification) => (
            <Notification key={notification._id} notification={notification} />
          ))}
        </div>
      );
    }
    return <NotFound />;
  }
  return <LoadingSpinner />;
};

export default ViewNotifications;
