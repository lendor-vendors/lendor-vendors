import { Selector } from 'testcafe';

class ViewItemPage {
  constructor() {
    this.pageId = '#view-item-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async editItem(testController) {
    await testController.click(Selector('.card'));
    const buttons = Selector('#btn1');
    await testController.click(buttons.withText('EDIT'));
    await testController.typeText('#edit-item-form-name', 's');
    await testController.click('#edit-item-form-submit input.btn.btn-primary');
    await testController.click(Selector('.swal-button--confirm'));
  }

  async viewRequest(testController) {
    await testController.click(Selector('.card'));
    const buttons = Selector('#btn1');
    await testController.click(buttons.withText('View Requests'));
  }
}

export const viewItemPage = new ViewItemPage();
