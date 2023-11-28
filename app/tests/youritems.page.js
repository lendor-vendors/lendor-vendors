import { Selector } from 'testcafe';

class YourItemsPage {
  constructor() {
    this.pageId = '#your-items-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts that the default data 2 of cards show up. */
  async hasdefaultItem(testController) {
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(2);
  }

  async clickItem(testController) {
    await testController.click(Selector('.card'));
  }
}

export const yourItemsPage = new YourItemsPage();
