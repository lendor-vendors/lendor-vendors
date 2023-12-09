import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';

const GoBackButton = () => {
  const history = useNavigate();
  return (
    <><ChevronLeft /><Button className="px-0" variant="link" style={{ color: 'black' }} onClick={() => history(-1)}>Back</Button></>
  );
};

export default GoBackButton;
