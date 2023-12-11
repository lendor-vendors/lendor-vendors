import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Col, Container, Row } from 'react-bootstrap';
import { Pagination } from '@mui/material';
import { Notifications } from '../../api/notification/Notifications';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';

const ITEM_PER_PAGE = 10;
const ViewNotifications = () => {
  const { _id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { notifications, ready } = useTracker(() => {
    const currentUser = Meteor.user();
    const notificationsSubscription = Meteor.subscribe(Notifications.toUserPublicationName);
    const rdy = notificationsSubscription.ready();
    const foundNotifications = Notifications.collection
      .find({ to: currentUser?.username }, { sort: { timestamp: -1 } })
      .fetch();
    return {
      notifications: foundNotifications,
      ready: rdy,
    };
  }, [currentPage, _id]);
  const totalPages = Math.ceil(notifications.length / ITEM_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (ready) {
    return (
      <Container id="notification-page" className="py-3">
        <Row className="justify-content-center">
          <Col md={7}>
            <Col className="text-center">
              <h2>Your Notifications</h2>
              <hr />
              {notifications.length > 0 ? (
                <div>
                  {notifications.map((notification) => (
                    <Notification key={notification._id} notification={notification} />
                  ))}
                </div>
              ) : (
                <p>No notifications</p>
              )}
            </Col>
          </Col>
        </Row>
        <Container className="mt-3 d-flex justify-content-center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="standard"
            size="large"
            className="mt-3"
          />
        </Container>
      </Container>
    );
  }

  return <LoadingSpinner />;
};

export default ViewNotifications;
