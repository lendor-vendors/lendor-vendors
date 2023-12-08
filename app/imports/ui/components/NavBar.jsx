import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink, useNavigate } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PencilSquare, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { Profiles } from '../../api/profile/Profiles';
import { Notifications } from '../../api/notification/Notifications';

const NavBar = () => {
  const { currentUser } = useTracker(() => {
    const user = Meteor.user();
    Meteor.subscribe(Notifications.toUserPublicationName);

    return {
      currentUser: user ? user.username : '',
      unreadNotifications: Notifications.collection
        .find({ to: user?.username, read: false }, { sort: { createdAt: -1 }, limit: 3 })
        .fetch(),
    };
  });
  function getProfilePromise() {
    return new Promise((resolve) => {
      const subscription = Meteor.subscribe(Profiles.userPublicationName);
      const handle = setInterval(() => {
        if (subscription.ready() && currentUser) {
          clearInterval(handle); // Stop checking
          resolve(); // Resolve the promise when the subscription is ready
        }
      }, 100); // Check every 100ms for subscription.ready()
    });
  }

  async function getProfile() {
    await getProfilePromise();
    const documents = Profiles.collection.find({ email: currentUser }).fetch();
    if (documents) { // Found the current user's profile
      return documents[0];
    }
    return null; // Something went wrong
  }
  const navigate = useNavigate();
  return (
    <Navbar bg="dark navbar-dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <h2>Lendor Vendors</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {currentUser ? ([
              <Nav.Link id="gallery-item-nav" as={NavLink} to="/gallery" key="gallery">Gallery</Nav.Link>,
              <Nav.Link id="your-items-nav" as={NavLink} to="/your_items" key="your_items">Your Items</Nav.Link>,
              <Nav.Link id="post-item-nav" as={NavLink} to="/post" key="post">Post Item</Nav.Link>,
              <Nav.Link id="requests-nav" as={NavLink} to="/requests" key="requests">Requests</Nav.Link>,
              <Nav.Link id="forums-nav" as={NavLink} to="/forums" key="forums">Forums</Nav.Link>,
              <Nav.Link id="notifications-nav" as={NavLink} to="/notifications" key="notifications">Your Notifications</Nav.Link>,
            ]) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
              <Nav.Link id="list-stuff-admin-nav" as={NavLink} to="/admin" key="admin">Admin</Nav.Link>
            ) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown className="hover-dropdown" id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" as={NavLink} to="/signin">
                  <PersonFill />
                  Sign
                  in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" as={NavLink} to="/signup">
                  <PersonPlusFill />
                  Sign
                  up
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown className="hover-dropdown" id="navbar-current-user" title={currentUser}>
                <NavDropdown.Item
                  id="navbar-view-profile"
                  onClick={() => {
                    getProfile().then((profile) => {
                      if (profile) {
                        navigate(`/view_profile/${profile._id}`);
                      } else {
                        console.log('Profile not found.');
                      }
                    });
                  }}
                >
                  <PersonFill />{' '}Your Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  id="navbar-edit-profile"
                  onClick={() => {
                    console.log('CURRENT USER: ', currentUser);
                    getProfile().then((profile) => {
                      if (profile) {
                        navigate(`/edit_profile/${profile._id}`);
                      } else {
                        console.log('Profile not found.');
                      }
                    });
                  }}
                >
                  <PencilSquare /> Edit Profile
                </NavDropdown.Item>
                <NavDropdown.Item id="navbar-sign-out" as={NavLink} to="/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign
                  out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
