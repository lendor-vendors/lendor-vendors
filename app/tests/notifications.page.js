import { Selector } from 'testcafe';

class NotificationPage {
  constructor() {
    this.pageId = '#notification-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const notificationPage = new NotificationPage();
