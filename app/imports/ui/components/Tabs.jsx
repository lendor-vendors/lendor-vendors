import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Row } from 'react-bootstrap';

const Tabs = ({ tabNames, sendCurrentTab }) => {
  const [currentTab, setCurrentTab] = useState(tabNames[0]);
  return (
    <Row>
      <Container className="d-flex justify-content-evenly">
        {tabNames.map((tabName) => (
          // Button component is temporary. TODO: Re-style tab buttons to look better
          <Button
            onClick={() => {
              setCurrentTab(tabName);
              sendCurrentTab(tabName);
            }}
            style={{
              width: '100%',
              borderRadius: 0,
            }}
            variant={currentTab === tabName ? 'success' : 'outline-dark'}
          >{tabName}
          </Button>
        ))}
      </Container>
    </Row>
  );
};

Tabs.propTypes = {
  tabNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  sendCurrentTab: PropTypes.func.isRequired,
};

export default Tabs;
