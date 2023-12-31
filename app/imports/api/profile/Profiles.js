import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/**
 * The ProfilesCollection. It encapsulates state and variable values for Profile.
 */
class ProfilesCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ProfilesCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      name: String,
      image: { type: String, optional: true },
      rating: { type: Number, min: 0, max: 5 },
      contactInfo: { type: String, optional: true },
      email: { type: String, index: true, unique: true },
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the ProfilesCollection.
 * @type {ProfilesCollection}
 */
export const Profiles = new ProfilesCollection();
