import { Selector } from 'testcafe';

class GalleryPage {
  constructor() {
    this.pageId = '#gallery-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts that the default data of 3 cards show up. */
  async hasdefaultItem(testController) {
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(3);
  }

  /** Clicks on the first item in the gallery. */
  async clickItem(testController) {
    await testController.click(Selector('.card'));
  }
}

export const galleryPage = new GalleryPage();
