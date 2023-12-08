import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/**
 * The ReviewsCollection. It encapsulates state and variable values for Profile.
 */
class ReviewsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ReviewsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      reviewee: { type: String, required: false },
      reviewer: { type: String, required: false },
      rating: { type: Number, min: 0, max: 5, required: false },
      comment: { type: String, required: false },
      timeStamp: { type: Date, required: false },
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the ReviewsCollection.
 * @type {ReviewsCollection}
 */
export const Reviews = new ReviewsCollection();
