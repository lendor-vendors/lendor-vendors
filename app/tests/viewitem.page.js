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
    const buttons = Selector('#btn1');
    await testController.click(buttons.withText('VIEW REQUESTS'));
  }

  async makeRequest(testController) {
    await testController.click('#btn1');
  }

  async deleteItem(testController) {
    const buttons = Selector('#btn1');
    await testController.click(buttons.withText('DELETE POST'));
    await testController.click(('#yes-delete'));
  }
}

export const viewItemPage = new ViewItemPage();
