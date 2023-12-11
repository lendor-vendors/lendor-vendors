import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink, useNavigate } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PencilSquare, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { Profiles } from '../../api/profile/Profiles';
import { Notifications } from '../../api/notification/Notifications';
import NotificationDropDown from './NotificationDropDown';

const NavBar = () => {
  const { currentUser, currentUserProfile, unreadNotifications } = useTracker(() => {
    const user = Meteor.user();
    Meteor.subscribe(Notifications.toUserPublicationName);
    Meteor.subscribe(Profiles.userPublicationName);
    const foundCurrentUserProfile = Profiles.collection.findOne({ email: user?.username });
    return {
      currentUser: user ? user.username : '',
      currentUserProfile: foundCurrentUserProfile,
      unreadNotifications: Notifications.collection
        .find({ to: user?.username, read: false }, { sort: { createdAt: -1 }, limit: 3 })
        .fetch(),
    };
  });
  return (
    <Navbar bg="dark navbar-dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <h2><Image src="\images\logo.png" alt="shrimp" className="shrimp" /> Lendor Vendors</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start pb-2">
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
          <Nav className="justify-content-end pb-2">
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
              <>
                <Container className="pt-2"><NotificationDropDown notifications={unreadNotifications}/></Container>
                <NavDropdown
                  className="hover-dropdown"
                  id="navbar-current-user"
                  title={(
                    <Image
                      src={currentUserProfile?.image || ''}
                      style={{ height: '40px', width: '40px' }}
                      roundedCircle
                    />
                  )}
                >
                  <NavDropdown.Item
                    id="navbar-view-profile"
                    href={`/view_profile/${currentUserProfile?._id}`}
                  >
                    <PersonFill />{' '}Your Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    id="navbar-edit-profile"
                    href={`/edit_profile/${currentUserProfile?._id}`}
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
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
