import { Selector } from 'testcafe';

class ViewRequestPage {
  constructor() {
    this.pageId = '#view-request-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const viewRequestPage = new ViewRequestPage();
