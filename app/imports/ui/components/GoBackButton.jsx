import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { ArrowLeft } from 'react-bootstrap-icons';

const GoBackButton = () => {
  const history = useNavigate();
  return (
    <Button startIcon={<ArrowLeft />} className="px-1" variant="link" style={{ color: 'black' }} onClick={() => history(-1)}>Back
    </Button>
  );
};

export default GoBackButton;
