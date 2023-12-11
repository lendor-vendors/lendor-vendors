import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Profiles } from '../../api/profile/Profiles';
import { Items } from '../../api/item/Items';
import { insertReviewMethod, insertRequestMethod } from '../both/Methods.js';
import { ForumRequests } from '../../api/forumRequest/ForumRequests';
/* eslint-disable no-console */

// Initialize the database with a default data document.
Meteor.users.allow({ update: () => true });
Meteor.users.deny({ update: () => false });

/* eslint-disable no-console */
// Create user account used for logging in and out
const createUser = (email, password, role) => {
  console.log(`  Creating user ${email}.`);
  const userID = Accounts.createUser({
    username: email,
    email: email,
    password: password,
  });
  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  }
};

// Create user account used for logging in and out and then create a new profile with this account's email
const createProfile = ({ name, image, rating, contactInfo, email, password, role }) => {
  // create user and add to profiles collection
  createUser(email, password, role);
  console.log(name, image, rating, contactInfo, email, password, role);
  Profiles.collection.insert({ name, image, rating, contactInfo, email });
};

const addItem = (item) => {
  console.log(`Inserting ${item.title}, owner ${item.owner}`);
  Items.collection.insert(item);
};

const addReview = (review) => {
  console.log(`Inserting review for ${review.reviewee} by reviewer ${review.reviewer}`);
  Meteor.call(insertReviewMethod, review);
};

const addForum = (forum) => {
  console.log(`Inserting forum ${forum.title}`);
  ForumRequests.collection.insert(forum);
};
// When running app for first time, pass a settings file to set up a default user account.
// Create default data
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultProfiles && Meteor.settings.defaultItems) {
    console.log('Creating the default profiles(s)');
    Meteor.settings.defaultProfiles.map(profile => createProfile(profile));
    console.log('Creating the default item(s)');
    Meteor.settings.defaultItems.forEach((item) => addItem(item));
    console.log('Creating the default reviews');
    Meteor.settings.defaultReviews.forEach((review) => addReview(review));
    console.log('Creating the default forum requests');
    Meteor.settings.defaultForums.forEach((forum) => addForum(forum));
    console.log('Creating the default requests');
    const bio350CourseReader = Items.collection.findOne({ title: 'BIO 350 Course Reader' });
    const defaultRequests = [
      {
        itemId: bio350CourseReader._id,
        quantity: 1,
        requester: 'admin@foo.com',
      },
      {
        itemId: bio350CourseReader._id,
        quantity: 1,
        requester: 'kim@foo.com',
      },
      {
        itemId: bio350CourseReader._id,
        quantity: 1,
        requester: 'elijah@foo.com',
      },
      {
        itemId: bio350CourseReader._id,
        quantity: 1,
        requester: 'harper@foo.com',
      },
      {
        itemId: bio350CourseReader._id,
        quantity: 1,
        requester: 'elizabeth@foo.com',
      },
      {
        itemId: bio350CourseReader._id,
        quantity: 1,
        requester: 'noah@foo.com',
      },
      {
        itemId: bio350CourseReader._id,
        quantity: 1,
        requester: 'james@foo.com',
      },
      {
        itemId: bio350CourseReader._id,
        quantity: 1,
        requester: 'will@foo.com',
      },
      {
        itemId: bio350CourseReader._id,
        quantity: 1,
        requester: 'alex@foo.com',
      },
      {
        itemId: bio350CourseReader._id,
        quantity: 1,
        requester: 'ben@foo.com',
      },
      {
        itemId: bio350CourseReader._id,
        quantity: 1,
        requester: 'sarah@foo.com',
      },
    ];
    defaultRequests.forEach((defaultRequest) => {
      Meteor.call(insertRequestMethod, defaultRequest);
    });
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
