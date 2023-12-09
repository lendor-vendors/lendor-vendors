import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signupPage } from './signup.page';
import { navBar } from './navbar.component';
import { galleryPage } from './gallery.page';
import { yourItemsPage } from './youritems.page';
import { postItemPage } from './postitem.page';
import { requestsPage } from './requests.page';
import { forumsPage } from './forums.page';
import { notificationPage } from './notifications.page';
import { viewItemPage } from './viewitem.page';
import { viewProfilePage } from './viewprofile.page';
import { editItemPage } from './edititem.page';
import { viewRequestPage } from './viewrequest.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const itemInfo = { title: 'keyboard', Image: 'https://meletrix.com/cdn/shop/products/1_cdbe2228-08f5-4bd6-b32e-5ead50ef7bdd.jpg?v=1680462885&width=2048', Description: 'old keyboard', quantity: '1' };

fixture('meteor-application-template-react localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that gallery page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.gotoGalleryPage(testController);
  await galleryPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that your items page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.gotoYourItemsPage(testController);
  await yourItemsPage.isDisplayed(testController);
  await yourItemsPage.hasdefaultItem(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that post item works', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.gotoPostItemPage(testController);
  await postItemPage.isDisplayed(testController);
  await postItemPage.postItem(testController, itemInfo.title, itemInfo.Image, itemInfo.Description, itemInfo.quantity);
  await navBar.gotoYourItemsPage(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that edit item form works', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.gotoYourItemsPage(testController);
  await yourItemsPage.isDisplayed(testController);
  await viewItemPage.editItem(testController);
  await editItemPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that requests page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.gotoRequestsPage(testController);
  await requestsPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that forums page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.gotoForumsPage(testController);
  await forumsPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that notifications page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.gotoNotificationsPage(testController);
  await notificationPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that view item page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.gotoYourItemsPage(testController);
  await yourItemsPage.clickItem(testController);
  await viewItemPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that view request page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoYourItemsPage(testController);
  await viewItemPage.viewRequest(testController);
  await viewRequestPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that view profile shows up and displays correct number of cards', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoViewProfilePage(testController);
  await viewProfilePage.isDisplayed(testController);
  await viewProfilePage.hasDefaultProfile(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that signup and then signout works', async (testController) => {
  // Create a new user email address that's guaranteed to be unique.
  const newUser = `user-${new Date().getTime()}@foo.com`;
  const newName = 'Chuck';
  await navBar.gotoSignUpPage(testController);
  await signupPage.signupUser(testController, newName, newUser, credentials.password);
  // New user has successfully logged in, so now let's logout.
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});
