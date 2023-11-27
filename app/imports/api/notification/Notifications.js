import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/**
 * The NotificationsCollection. It encapsulates state and variable values for Notification.
 */
class NotificationsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'NotificationsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      to: String,
      from: String,
      message: String,
      itemId: String,
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
 * The singleton instance of the NotificationsCollection.
 * @type {NotificationsCollection}
 */
export const Notifications = new NotificationsCollection();
