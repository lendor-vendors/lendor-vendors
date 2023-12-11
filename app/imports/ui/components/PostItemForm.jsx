import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoForm, ErrorsField, LongTextField, NumField, SelectField, SubmitField, TextField } from 'uniforms-mui';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useTracker } from 'meteor/react-meteor-data';
import { Items } from '../../api/item/Items';
import ImageField from './ImageField';
import { Profiles } from '../../api/profile/Profiles';
import LoadingSpinner from './LoadingSpinner';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  title: String,
  image: { type: String, optional: true },
  description: { type: String, optional: true },
  quantity: { type: SimpleSchema.Integer, defaultValue: 1, min: 1 },
  condition: { type: String, allowedValues: ['Poor', 'Acceptable', 'Good', 'Excellent'] },
});

const bridge = new SimpleSchema2Bridge(formSchema);
const PostItemForm = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState(null);
  const currentUser = useTracker(() => Meteor.user());
  const { poster, ready } = useTracker(() => {
    const profilesSubscription = Meteor.subscribe(Profiles.userPublicationName);
    const rdy = profilesSubscription.ready();
    const foundposter = Profiles.collection.findOne({ email: currentUser?.username });
    return {
      poster: foundposter,
      ready: rdy,
    };
  });
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { title, description, quantity, condition } = data;
    const owner = currentUser?.username;
    const createdAt = new Date().toISOString();
    const insertedId = Items.collection.insert(
      { title, image: uploadedImage, description, quantity, condition, owner, createdAt },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
          navigate(`/view_item/${insertedId}`);
        }
      },
    );
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  if (ready) {
    return (poster.contactInfo && poster.contactInfo !== '') ? (
      <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
        <TextField id="post-item-form-name" name="title" className="mb-3" />
        <ImageField name="image" onChange={setUploadedImage} />
        <LongTextField id="post-item-form-description" name="description" className="mb-2" />
        <NumField id="post-item-form-quantity" name="quantity" decimal={false} className="mb-2" />
        <SelectField id="post-item-form-condition" name="condition" className="mb-2" />
        <SubmitField id="post-item-form-submit" value="Post" />
        <ErrorsField />
      </AutoForm>
    ) : <p>You have no contact info! Please <a href={`/edit_profile/${poster._id}`}>edit your profile</a> and add your contact information before posting an item.</p>;
  }
  return <LoadingSpinner />;
};

export default PostItemForm;
