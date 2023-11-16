import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';
import TempItem from '../components/TempItem';

/* Renders the EditContact page for editing a single itemument. */
const ViewItem = () => {
  // Get the itemID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditContact', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { item, ready } = useTracker(() => {
    // Get access to Stuff items.
    const subscription = Meteor.subscribe(Items.adminPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the item
    const foundItem = Items.collection.findOne(_id);
    return {
      item: foundItem,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditContact', item, ready);
  // On successful submit, insert the data.
  return ready ? (<TempItem item={item} />) : <LoadingSpinner />;
};

export default ViewItem;
