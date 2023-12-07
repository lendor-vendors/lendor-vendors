import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import PostItemForm from '../components/PostItemForm';

const PostItem = () => (
  <Container id="post-item-page" className="py-3">
    <Row className="justify-content-center">
      <Col xs={5}>
        <Col className="text-center"><h2>Post Item</h2></Col>
        <Card>
          <Card.Body>
            <PostItemForm />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default PostItem;
