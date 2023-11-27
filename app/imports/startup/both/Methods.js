import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { Accounts } from 'meteor/accounts-base';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import { ForumRequests } from '../../api/forumRequest/ForumRequests';
import { Profiles } from '../../api/profile/Profiles';
// import { Profiles } from '../../api/profile/Profiles';

const acceptRequestMethod = 'Requests.accept';
const denyRequestMethod = 'Requests.deny';
const cancelRequestMethod = 'Requests.cancel';

/**
 * The server-side Profiles.update Meteor Method is called by the client-side Home page after pushing the update button.
 * Its purpose is to update the Profiles, ProfilesInterests, and ProfilesProjects collections to reflect the
 * updated situation specified by the user.
 */
Meteor.methods({
  'Requests.accept'({ requestId, requestQuantity, itemId, itemQuantity, toDenyRequests }) {
    Requests.collection.update({ _id: requestId }, { $set: { status: 'accepted' } });
    const updatedQuantity = itemQuantity - requestQuantity;
    Items.collection.update({ _id: itemId }, { $set: { quantity: updatedQuantity } });
    toDenyRequests.forEach((toDenyRequest) => Meteor.call(
      denyRequestMethod,
      { requestId: toDenyRequest._id },
    ));
  },
  'Requests.deny'({ requestId }) {
    Requests.collection.update({ _id: requestId }, { $set: { status: 'denied' } });
  },
  'Requests.cancel'({ requestId }) {
    Requests.collection.remove({ _id: requestId });
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
  'Profiles.update'({ profileId, name, image, contactInfo, email }) {
    console.log('Called Profiles.update with profileId: ', profileId);
    const currentUser = Meteor.users.findOne(this.userId);
    console.log(currentUser);
    if (Meteor.isServer) {
      Accounts.removeEmail(this.userId, currentUser.emails[0].address);
      Accounts.addEmail(this.userId, email);
    }
    Meteor.users.update({ _id: currentUser._id }, { $set: { username: email } });
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

export { acceptRequestMethod, denyRequestMethod, cancelRequestMethod, removeItemMethod, updateProfileMethod, resolveForumRequestMethod, removeForumRequestMethod };
