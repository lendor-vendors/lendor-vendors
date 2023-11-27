import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Col, Container, Row } from 'react-bootstrap';
import { Notifications } from '../../api/notification/Notifications';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification'; // Import the modified Notification component

const ViewNotifications = () => {
  const { _id } = useParams();
  const { notifications, ready } = useTracker(() => {
    const notificationsSubscription = Meteor.subscribe(Notifications.toUserPublicationName);
    const rdy = notificationsSubscription.ready();
    const foundNotifications = Notifications.collection.find({ to: Meteor.userId() }).fetch();
    return {
      notifications: foundNotifications,
      ready: rdy,
    };
  }, [_id]);

  if (ready) {
    return (
      <Container className="py-3">
        <Row className="justify-content-center">
          <Col md={7}>
            <Col className="text-center">
              <h2>Your Notifications</h2>
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
      </Container>
    );
  }

  return <LoadingSpinner />;
};

export default ViewNotifications;
