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

  async editProfile(testController) {
    await testController.selectText('#edit-profile-name');
    await testController.pressKey('delete');
    await testController.typeText('#edit-profile-name', 'Philip Johnson');
    await testController.click('#edit-profile-submit input.btn.btn-primary');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const viewProfilePage = new ViewProfilePage();
