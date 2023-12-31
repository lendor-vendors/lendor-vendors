import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/**
 * The RequestsCollection. It encapsulates state and variable values for Request.
 */
class RequestsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'RequestsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      itemId: String,
      quantity: { type: SimpleSchema.Integer, min: 1 },
      requester: String,
      requestedAt: {
        type: Date,
        defaultValue: new Date(),
      },
      status: {
        type: String,
        allowedValues: ['pending', 'accepted', 'denied'],
        defaultValue: 'pending',
      },
      timestamp: {
        type: Date,
        defaultValue: new Date(),
      },
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.toUserPublicationName = `${this.name}.publication.toUser`;
    this.fromUserPublicationName = `${this.name}.publication.fromUser`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the RequestsCollection.
 * @type {RequestsCollection}
 */
export const Requests = new RequestsCollection();
