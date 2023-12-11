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
import { editProfilePage } from './editProfile.page';
import { reviewFormPage } from './reviewForm.page';
import { forumsDetailsPage } from './forumsInfo.page';
import { makeRequestPage } from './request.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const itemInfo = { title: 'keyboard', Description: 'old keyboard', quantity: '1' };

fixture('meteor-application-template-react localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that gallery page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoGalleryPage(testController);
  await galleryPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that your items page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoYourItemsPage(testController);
  await yourItemsPage.isDisplayed(testController);
  await yourItemsPage.hasdefaultItem(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that post item works', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoPostItemPage(testController);
  await postItemPage.isDisplayed(testController);
  await postItemPage.postItem(testController, itemInfo.title, itemInfo.Description, itemInfo.quantity);
  await navBar.gotoYourItemsPage(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that edit item form works', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoYourItemsPage(testController);
  await yourItemsPage.isDisplayed(testController);
  await viewItemPage.editItem(testController);
  await editItemPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that deleting item works', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoYourItemsPage(testController);
  await yourItemsPage.isDisplayed(testController);
  await yourItemsPage.clickItem(testController);
  await viewItemPage.deleteItem(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that requests page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoRequestsPage(testController);
  await requestsPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that request page shows up by going through view item page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoYourItemsPage(testController);
  await yourItemsPage.isDisplayed(testController);
  await yourItemsPage.clickItem(testController);
  await viewItemPage.isDisplayed(testController);
  await viewItemPage.viewRequest(testController);
  await requestsPage.isDisplayed(testController);
});

test.only('Test making a request works', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoGalleryPage(testController);
  await galleryPage.isDisplayed(testController);
  await galleryPage.clickItem(testController);
  await viewItemPage.isDisplayed(testController);
  await viewItemPage.makeRequest(testController);
  await makeRequestPage.isDisplayed(testController);
  await makeRequestPage.makeRequest(testController);
});

test('Test that forums page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoForumsPage(testController);
  await forumsPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that notifications page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoNotificationsPage(testController);
  await notificationPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that view item page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
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
  await yourItemsPage.clickItem(testController);
  await viewItemPage.isDisplayed(testController);
  await viewItemPage.viewRequest(testController);
  await requestsPage.isDisplayed(testController);
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

test('Test that review form page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoReviewPage(testController);
  await reviewFormPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that review form works', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoReviewPage(testController);
  await reviewFormPage.isDisplayed(testController);
  await reviewFormPage.giveReview(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that edit profile page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoEditProfilePage(testController);
  await editProfilePage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that edit profile page shows up through the view profile page button', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoViewProfilePage(testController);
  await viewProfilePage.isDisplayed(testController);
  await viewProfilePage.clickEditProfile(testController);
  await editProfilePage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that edit profile form works', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoEditProfilePage(testController);
  await editProfilePage.isDisplayed(testController);
  await viewProfilePage.editProfile(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that post forum form works', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoForumsPage(testController);
  await forumsPage.isDisplayed(testController);
  await forumsPage.postForum(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that view forum details page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoForumsPage(testController);
  await forumsPage.isDisplayed(testController);
  await forumsPage.viewForum(testController);
  await forumsDetailsPage.isDisplayed(testController);
  await navBar.logout(testController);
  await landingPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
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
