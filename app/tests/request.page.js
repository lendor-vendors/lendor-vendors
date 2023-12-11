import { Selector } from 'testcafe';

class MakeRequestpage {
  constructor() {
    this.pageId = '#make-request-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async makeRequest(testController) {
    await testController.click('#request-form-submit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const makeRequestPage = new MakeRequestpage();
