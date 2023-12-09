import { Selector } from 'testcafe';

class ViewProfilePage {
  constructor() {
    this.pageId = '#view-profile-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async hasDefaultProfile(testController) {
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(2);
  }
}

export const viewProfilePage = new ViewProfilePage();
