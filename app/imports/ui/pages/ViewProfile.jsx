import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from './NotFound';
import { Profiles } from '../../api/profile/Profiles';
import Profile from '../components/Profile';

const ViewProfile = () => {
  // Get the itemID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditContact', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { profile, ready } = useTracker(() => {
    // Get access to Stuff items.
    const profilesSubscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = profilesSubscription.ready();
    // Get the item
    const profileToDisplay = Profiles.collection.findOne(_id);
    return {
      profile: profileToDisplay,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditContact', item, ready);
  // On successful submit, insert the data.
  if (ready) {
    if (profile) {
      return <Profile profile={profile} />;
    }
    return <NotFound />;
  }
  return <LoadingSpinner />;
};

export default ViewProfile;
