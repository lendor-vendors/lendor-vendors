import React, { useState } from 'react';
import { Button } from '@mui/material';
import { CloudUploadFill } from 'react-bootstrap-icons';
import { connectField } from 'uniforms';
import PropTypes from 'prop-types';

const ImageUpload = ({ onChange }) => {
  const [imagePreview, setImagePreview] = useState(null);
  return (
    <div className="ImageField">
      <div>Upload an image</div>
      <label htmlFor="file-input">
        <Button component="label" variant="contained" startIcon={<CloudUploadFill />}>
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

ImageUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default ImageField;
