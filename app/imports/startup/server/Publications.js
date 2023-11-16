import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Stuffs } from '../../api/stuff/Stuff';
import { Profiles } from '../../api/profile/Profiles';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';

// User-level publication.
// If logged in, then publish documents owned by this user. Otherwise, publish nothing.
Meteor.publish(Stuffs.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Stuffs.collection.find({ owner: username });
  }
  return this.ready();
});

// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise, publish nothing.
Meteor.publish(Stuffs.adminPublicationName, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Stuffs.collection.find();
  }
  return this.ready();
});

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

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
