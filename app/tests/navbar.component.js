import { Selector } from 'testcafe';

class NavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector('#navbar-current-user').exists;
    if (loggedInUser) {
      await testController.click('#navbar-current-user');
      await testController.click('#navbar-sign-out');
    }
  }

  async gotoSignInPage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#login-dropdown');
    await testController.click('#login-dropdown-sign-in');
  }

  /** Check that the specified user is currently logged in. */
  async isLoggedIn(testController, username) {
    const loggedInUser = Selector('#navbar-current-user').innerText;
    await testController.expect(loggedInUser).eql(username);
  }

  /** Check that someone is logged in, then click items to logout. */
  async logout(testController) {
    await testController.expect(Selector('#navbar-current-user').exists).ok();
    await testController.click('#navbar-current-user');
    await testController.click('#navbar-sign-out');
  }

  /** Pull down login menu, go to sign up page. */
  async gotoSignUpPage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#login-dropdown');
    await testController.click('#login-dropdown-sign-up');
  }

  /** Go to gallery page after log in. */
  async gotoGalleryPage(testController) {
    await testController.click('#gallery-item-nav');
  }

  async gotoYourItemsPage(testController) {
    await testController.click('#your-items-nav');
  }

  async gotoPostItemPage(testController) {
    await testController.click('#post-item-nav');
  }

  async gotoRequestsPage(testController) {
    await testController.click('#requests-nav');
  }

  async gotoForumsPage(testController) {
    await testController.click('#forums-nav');
  }

  async gotoNotificationsPage(testController) {
    await testController.click('#notifications-nav');
  }

  async gotoViewProfilePage(testController) {
    await testController.click('#navbar-current-user');
    await testController.click('#navbar-view-profile');
  }
}

export const navBar = new NavBar();
