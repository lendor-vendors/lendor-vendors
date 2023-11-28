import { Selector } from 'testcafe';

class RequestsPage {
  constructor() {
    this.pageId = '#requests-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const requestsPage = new RequestsPage();
