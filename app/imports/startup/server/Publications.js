import { Meteor } from 'meteor/meteor';
import { Profiles } from '../../api/profile/Profiles';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import { ForumRequests } from '../../api/forumRequest/ForumRequests';
import { Notifications } from '../../api/notification/Notifications';
import { Reviews } from '../../api/review/Reviews';

Meteor.publish(Profiles.userPublicationName, () => Profiles.collection.find());
// For YourItems
Meteor.publish(Items.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Items.collection.find({ owner: username });
  }
  return this.ready();
});
// For gallery
Meteor.publish(Items.adminPublicationName, () => Items.collection.find());

// Publish all requests for each of the current user's items
Meteor.publish(Requests.toUserPublicationName, function () {
  if (this.userId) {
    // Get the user's username
    const username = Meteor.users.findOne(this.userId).username;
    // Get all items that this user owns
    const userItems = Items.collection.find({ owner: username }).fetch();
    // Take the IDs of all those items
    const idList = userItems.map(item => item._id);
    // Find all requests that are for one of these items
    return Requests.collection.find({ itemId: { $in: idList } });
  }
  return this.ready();
});
// Publish all outgoing requests from this user
Meteor.publish(Requests.fromUserPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Requests.collection.find({ requester: username });
  }
  return this.ready();
});

Meteor.publish(Requests.adminPublicationName, () => Requests.collection.find());

Meteor.publish(ForumRequests.userPublicationName, () => ForumRequests.collection.find());

Meteor.publish(Notifications.toUserPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Notifications.collection.find({ to: username });
  }
  return this.ready();
});

Meteor.publish(Notifications.fromUserPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Notifications.collection.find({ from: username });
  }
  return this.ready();
});

Meteor.publish(Notifications.adminPublicationName, () => Notifications.collection.find());

Meteor.publish(Reviews.userPublicationName, () => Reviews.collection.find());

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
