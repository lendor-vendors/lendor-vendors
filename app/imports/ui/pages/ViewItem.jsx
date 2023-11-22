import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { Profiles } from '../../api/profile/Profiles';
import { Items } from '../../api/item/Items';
import Item from '../components/Item';
import NotFound from './NotFound';

const ViewItem = () => {
  // Get the itemID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditContact', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { item, ownerProfile, ready } = useTracker(() => {
    // Get access to Stuff items.
    const itemsSubscription = Meteor.subscribe(Items.adminPublicationName);
    const profilesSubscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = itemsSubscription.ready() && profilesSubscription.ready();
    // Get the item
    const foundItem = Items.collection.findOne(_id);
    const foundProfile = Profiles.collection.findOne({ email: foundItem?.owner });
    return {
      item: foundItem,
      ownerProfile: foundProfile,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditContact', item, ready);
  // On successful submit, insert the data.
  if (ready) {
    if (item) {
      return <Item item={item} ownerProfile={ownerProfile} />;
    }
    return <NotFound />;
  }
  return <LoadingSpinner />;
};

export default ViewItem;
