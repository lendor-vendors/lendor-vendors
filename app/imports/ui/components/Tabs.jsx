import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Row } from 'react-bootstrap';

const Tabs = ({ tabNames, initialTab, sendCurrentTab }) => {
  const [currentTab, setCurrentTab] = useState(initialTab || tabNames[0]);
  return (
    <Row>
      <Container className="d-flex justify-content-evenly">
        {tabNames.map((tabName, index) => (
          <Button
            key={index}
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
  initialTab: PropTypes.string,
};

Tabs.defaultProps = {
  initialTab: '',
};

export default Tabs;
