import React from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import { Items } from '../../api/item/Items';
import { Requests } from '../../api/request/Requests';
import ItemCard from '../components/ItemCard';

/* Renders the EditStuff page for editing a single document. */
const RequestsPage = () => {
  const { /* fromRequests, toRequests, */ ready } = useTracker(() => {
    // Get access to Stuff documents.
    const itemSubscription = Meteor.subscribe(Items.adminPublicationName);
    const fromRequestsSubscription = Meteor.subscribe(Requests.fromUserPublicationName);
    const toRequestsSubscription = Meteor.subscribe(Requests.toUserPublicationName);
    // Determine if the subscription is ready
    const rdy = itemSubscription.ready() && fromRequestsSubscription.ready() && toRequestsSubscription.ready();
    // Get the document
    // const foundFromRequests = Requests.collection.find().fetch();
    // const foundToRequests = Requests.collection.find().fetch();
    return {
      // fromRequests: foundFromRequests,
      // toRequests: foundToRequests,
      ready: rdy,
    };
  }, []);
  if (ready) {
    const username = Meteor.user().username;
    const fromRequests = Requests.collection.find({ requester: username });
    let numFromRequests = 0;
    const fromRequestsList = (
      <ListGroup>
        {fromRequests.map((request) => {
          numFromRequests++;
          const item = Items.collection.findOne({ _id: request.itemId });
          return (
            <ListGroup.Item key={request._id}>
              <Row>
                <Col>
                  <ItemCard item={item} />
                </Col>
                <Col>
                  <p>Owner: {item.owner}</p>
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
    const items = {};
    const toRequests = Requests.collection.find({ requester: { $not: username } });
    let numItems = 0;
    toRequests.forEach((request) => {
      // eslint-disable-next-line no-prototype-builtins
      if (items.hasOwnProperty(request.itemId)) {
        items[request.itemId].push(request.requester);
      } else {
        items[request.itemId] = [request.requester];
      }
    });
    const toRequestsList = (
      <ListGroup>
        {Object.keys(items).map((itemId) => {
          numItems++;
          const item = Items.collection.findOne({ _id: itemId });
          return (
            <ListGroup.Item>
              <Row>
                <Col>
                  <ItemCard item={item} />
                </Col>
                <Col>
                  {items[itemId].map((requester) => <p>{requester}</p>)}
                  <Button href={`/view_requests/${item._id}`}>View Requests</Button>
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
    return (
      <Container className="py-3">
        <Row className="justify-content-center text-center">
          <Col>
            <h3>You have made {numFromRequests} {numFromRequests === 1 ? 'request' : 'requests'}</h3>
            <ListGroup className="justify-content-center">
              {fromRequestsList}
            </ListGroup>
          </Col>
          <Col>
            <h3>{numItems} of your items have pending {numItems === 1 ? 'request' : 'requests'}</h3>
            <ListGroup className="justify-content-center">
              {toRequestsList}
            </ListGroup>
          </Col>
        </Row>

      </Container>
    );
  }
  return <LoadingSpinner />;
};

export default RequestsPage;
