import { Selector } from 'testcafe';
import { navBar } from './navbar.component';

class PostItemPage {
  constructor() {
    this.pageId = '#post-item-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Fills out and submits the form to post item, and checks to see correct number of items in your items page */
  async postItem(testController, title, image, description, quantity) {
    await this.isDisplayed(testController);
    await testController.typeText('#post-item-form-name', title);
    await testController.typeText('#post-item-form-image', image);
    await testController.typeText('#post-item-form-description', description);
    await testController.typeText('#post-item-form-quantity', quantity);
    const conditionSelect = Selector('#post-item-form-condition');
    const conditionOption = conditionSelect().find('option');
    await testController.click(conditionSelect);
    await testController.click(conditionOption.withText('Good'));
    await testController.click('#post-item-form-submit input.btn.btn-primary');
    await testController.click(Selector('.swal-button--confirm'));
    await navBar.gotoYourItemsPage(testController);
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(2);
  }
}

export const postItemPage = new PostItemPage();
