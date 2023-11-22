import { Meteor } from 'meteor/meteor';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import { Profiles } from '../../api/profile/Profiles';

const deleteRequestMethod = 'Requests.delete';
const acceptRequestMethod = 'Requests.accept';
const deleteItemMethod = 'Items.delete';

/**
 * Used to update the Request collection whenever requests are accepted or denied.
 */
Meteor.methods({
  'Requests.delete'({ requestId }) {
    Requests.collection.remove({ _id: requestId });
  },
  'Requests.accept'({ requestId, requestQuantity, itemId, itemQuantity }) {
    Requests.collection.update({ _id: requestId }, { $set: { status: 'accepted' } });
    const updatedQuantity = itemQuantity - requestQuantity;
    console.log('Item quantity: ', itemQuantity, 'Request quantity: ', requestQuantity);
    console.log('UPDATING ITEM ID: ', itemId);
    Items.collection.update({ _id: itemId }, { $set: { quantity: updatedQuantity } });
  },
});

Meteor.methods({
  'Items.delete'({ itemId }) {
    Items.collection.remove({ _id: itemId });
  },
});

Meteor.methods({
  'Profiles.update'({ profileId }) {
    console.log('Called Profiles.update with profileId: ', profileId);
  },
});

export { deleteRequestMethod, acceptRequestMethod, deleteItemMethod };
