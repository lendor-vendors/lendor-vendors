import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/**
 * The ForumRequestsCollection. It encapsulates state and variable values for Request.
 */
class ForumRequestsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ForumRequestsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      forumRequester: String,
      requestingQuantity: { type: SimpleSchema.Integer, defaultValue: 1, min: 0 },
      requestingCondition: { type: String, allowedValues: ['Poor', 'Acceptable', 'Good', 'Excellent'] },
      forumText: String,
      status: { type: String, allowedValues: ['unresolved', 'resolved'], defaultValue: 'unresolved' },
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the RequestsCollection.
 * @type {ForumRequestsCollection}
 */
export const ForumRequests = new ForumRequestsCollection();
