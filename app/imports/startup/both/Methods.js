import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import swal from 'sweetalert';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import { ForumRequests } from '../../api/forumRequest/ForumRequests';
import { Notifications } from '../../api/notification/Notifications';
import { Profiles } from '../../api/profile/Profiles';
import { Reviews } from '../../api/review/Reviews';

const acceptRequestMethod = 'Requests.accept';
const denyRequestMethod = 'Requests.deny';
const cancelRequestMethod = 'Requests.cancel';
const insertReviewMethod = 'Reviews.insert';

/**
 * The server-side Profiles.update Meteor Method is called by the client-side Home page after pushing the update button.
 * Its purpose is to update the Profiles, ProfilesInterests, and ProfilesProjects collections to reflect the
 * updated situation specified by the user.
 */
Meteor.methods({
  'Requests.accept'({ requestId, requestQuantity, itemId, itemQuantity, toDenyRequestIds }) {
    Requests.collection.update({ _id: requestId }, { $set: { status: 'accepted' } });
    const updatedQuantity = itemQuantity - requestQuantity;
    Items.collection.update({ _id: itemId }, { $set: { quantity: updatedQuantity } });
    // send notification
    const requester = Requests.collection.findOne({ _id: requestId }).requester;
    Notifications.collection.insert({
      to: requester,
      from: Meteor.user().username,
      message: 'accept',
      itemId: itemId,
      read: false,
    });
    toDenyRequestIds.forEach((toDenyRequestId) => {
      Meteor.call(
        denyRequestMethod,
        { requestId: toDenyRequestId },
      );
    });
  },
  'Requests.deny'({ requestId }) {
    const requester = Requests.collection.findOne({ _id: requestId }).requester;
    const itemId = Requests.collection.findOne({ _id: requestId }).itemId;
    Requests.collection.update({ _id: requestId }, { $set: { status: 'denied' } });
    // send notification
    Notifications.collection.insert({
      to: requester,
      from: Meteor.user().username,
      message: 'deny',
      itemId: itemId,
      read: false,
    });
  },
  'Requests.cancel'({ requestId }) {
    Requests.collection.remove({ _id: requestId });
  },
});

Meteor.methods({
  'Notifications.markAsRead'({ notificationId, userId }) {
    const notification = Notifications.collection.findOne({ _id: notificationId, to: userId, read: false });
    if (notification) {
      Notifications.collection.update({ _id: notificationId }, { $set: { read: true } });
    }
  },
});

const removeItemMethod = 'Items.remove';

Meteor.methods({
  'Items.remove'({ itemId }) {
    Items.collection.remove({ _id: itemId });
  },
});

const updateProfileMethod = 'Profiles.update';

Meteor.methods({
  'Profiles.update'({ profileId, name, image, contactInfo, email, oldEmail }) {
    Meteor.users.update({ _id: this.userId }, { $set: { username: email } });
    if (Meteor.isServer) {
      Accounts.removeEmail(this.userId, oldEmail);
      Accounts.addEmail(this.userId, email);
    }
    Profiles.collection.update({ _id: profileId }, { $set: { name, image, contactInfo, email } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Profile updated successfully', 'success')));
    Items.collection.update({ owner: oldEmail }, { $set: { owner: email } }, { multi: true });
  },
});

Meteor.methods({
  'Reviews.insert'({ reviewee, reviewer, rating, comment, timeStamp }) {
    console.log('Called Reviews.insert with reviewee: ', reviewee, ' reviewer: ', reviewer, ' rating: ', rating, ' comment: ', comment, ' timeStamp: ', timeStamp);
    Reviews.collection.insert({ reviewee, reviewer, rating, comment, timeStamp });
    // get all the rating into an array
    const ratings = Reviews.collection.find({ reviewee: reviewee }).fetch().map((review) => review.rating);
    // add everything up and divide by length
    const average = ratings.reduce((sum2, rating2) => sum2 + rating2, 0) / ratings.length;
    // update the profile with the new rating
    Profiles.collection.update({ email: reviewee }, { $set: { rating: average } });
    console.log('Updating profile with rating:', average);
  },
});

Meteor.methods({
  'Test.method'() {
    throw new Meteor.Error('test');
  },
});

const resolveForumRequestMethod = 'ForumRequests.resolve';
const removeForumRequestMethod = 'ForumRequests.remove';

Meteor.methods({
  'ForumRequests.resolve'({ forumRequestId }) {
    ForumRequests.collection.update({ _id: forumRequestId }, { $set: { status: 'resolved' } });
  },
  'ForumRequests.remove'({ forumRequestId }) {
    ForumRequests.collection.remove({ _id: forumRequestId });
  },
});

export { acceptRequestMethod, denyRequestMethod, cancelRequestMethod, removeItemMethod, resolveForumRequestMethod, removeForumRequestMethod, insertReviewMethod, updateProfileMethod };
