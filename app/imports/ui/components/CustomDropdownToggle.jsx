import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

const CustomDropdownToggle = React.forwardRef(({ onClick, children }, ref) => (
  <Button
    variant="contained"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    ref={ref}
    style={{ backgroundColor: '#198754' }}
  >
    {children}
  </Button>
));

CustomDropdownToggle.propTypes = {
  onClick: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.array,
};

CustomDropdownToggle.defaultProps = {
  children: [''],
};

export default CustomDropdownToggle;
