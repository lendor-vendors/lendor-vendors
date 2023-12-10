import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/**
 * The ItemsCollection. It encapsulates state and variable values for Item.
 */
class ItemsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ItemsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      title: String,
      image: { type: String, optional: true },
      description: { type: String, optional: true },
      quantity: { type: SimpleSchema.Integer, defaultValue: 1, min: 0 },
      condition: { type: String, allowedValues: ['Poor', 'Acceptable', 'Good', 'Excellent'] },
      owner: String,
      createdAt: {
        type: Date,
        defaultValue: new Date(),
      },
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the ItemsCollection.
 * @type {ItemsCollection}
 */
export const Items = new ItemsCollection();
