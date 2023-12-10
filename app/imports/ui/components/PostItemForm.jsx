import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoForm, ErrorsField, LongTextField, NumField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Button } from '@mui/material';
import { CloudUploadFill } from 'react-bootstrap-icons';
import { connectField } from 'uniforms';
import PropTypes from 'prop-types';
import { Items } from '../../api/item/Items';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  title: String,
  image: { type: String, optional: true },
  description: { type: String, optional: true },
  quantity: { type: SimpleSchema.Integer, defaultValue: 1, min: 1 },
  condition: { type: String, allowedValues: ['Poor', 'Acceptable', 'Good', 'Excellent'] },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const ImageUpload = ({ onChange }) => {
  const [imagePreview, setImagePreview] = useState(null);
  return (
    <div className="ImageField">
      <div>Upload an image</div>
      <label htmlFor="file-input">
        <Button id="file-upload" component="label" variant="contained" startIcon={<CloudUploadFill />}>
          Upload file
          <input
            accept="image/*"
            id="file-input"
            onChange={({ target: { files } }) => {
              if (files && files[0]) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  onChange(reader.result); // Pass the result (data URL) to the parent component
                };
                reader.readAsDataURL(files[0]); // Read the file as a data URL
                setImagePreview(reader.result);
                setImagePreview(URL.createObjectURL(files[0]));
              }
            }}
            style={{ display: 'none' }}
            type="file"
          />
        </Button>
      </label>
      <br />
      {imagePreview ? (
        <img
          className="my-2"
          alt=""
          src={imagePreview || ''}
          style={{ width: '150px', height: '150px' }}
        />
      ) : ''}
    </div>
  );
};
const ImageField = connectField(ImageUpload);
const PostItemForm = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState(null);
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { title, description, quantity, condition } = data;
    const owner = Meteor.user().username;
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
  return (
    <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
      <TextField id="post-item-form-name" name="title" />
      <ImageField name="image" onChange={setUploadedImage} />
      <LongTextField id="post-item-form-description" name="description" />
      <NumField id="post-item-form-quantity" name="quantity" decimal={false} />
      <SelectField id="post-item-form-condition" name="condition" />
      <SubmitField id="post-item-form-submit" value="Post" />
      <ErrorsField />
    </AutoForm>
  );
};

ImageUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default PostItemForm;
