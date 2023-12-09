import { Selector } from 'testcafe';

class ReviewFormPage {
  constructor() {
    this.pageId = '#review-form-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Tests that the review form works with valid input. */
  async giveReview(testController) {
    await testController.typeText('#review-user-comment', 'This is a test review.');
    await testController.click('#review-user-submit input.btn.btn-primary');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const reviewFormPage = new ReviewFormPage();
