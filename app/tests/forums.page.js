import { Selector } from 'testcafe';
import { navBar } from './navbar.component';

class ForumsPage {
  constructor() {
    this.pageId = '#forums-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async viewForum(testController) {
    await testController.click(Selector('div.card-header'));
  }

  async postForum(testController) {
    await testController.click(Selector('#post-forum'));
    await testController.typeText('#post-forum-form-title', 'Test Forum');
    await testController.typeText('#post-forum-form-quantity', '1');
    const conditionSelect = Selector('#post-forum-form-condition');
    const conditionOption = conditionSelect().find('option');
    await testController.click(conditionSelect);
    await testController.click(conditionOption.withText('Good'));
    await testController.typeText('#post-forum-form-description', 'Test Forum Description');
    await testController.click('#post-forum-form-submit input.btn.btn-primary');
    await testController.click(Selector('.swal-button--confirm'));
    await navBar.gotoForumsPage(testController);
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(2);
  }
}

export const forumsPage = new ForumsPage();
