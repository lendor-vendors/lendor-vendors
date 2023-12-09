import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Row } from 'react-bootstrap';

const Tabs = ({ tabNames, sendCurrentTab, currentTab }) => (
  <Row>
    <Container className="d-flex justify-content-evenly">
      {tabNames.map((tabName, index) => (
        // Button component is temporary. TODO: Re-style tab buttons to look better
        <Button
          key={index}
          onClick={() => {
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

Tabs.propTypes = {
  tabNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  sendCurrentTab: PropTypes.func.isRequired,
  currentTab: PropTypes.string.isRequired,
};

export default Tabs;
