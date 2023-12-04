import { Selector } from 'testcafe';

class ForumsPage {
  constructor() {
    this.pageId = '#forums-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const forumsPage = new ForumsPage();
