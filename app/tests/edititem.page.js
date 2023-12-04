import { Selector } from 'testcafe';

class EditItemPage {
  constructor() {
    this.pageId = '#edit-item-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const editItemPage = new EditItemPage();
