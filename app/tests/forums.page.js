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
    await testController.click(conditionSelect);
    const conditionOption = 'Good';
    const conditionOptionSelector = Selector('li').withText(conditionOption);
    await testController.click(conditionOptionSelector);
    await testController.typeText('#post-forum-form-description', 'Test Forum Description');
    await testController.click('#post-forum-form-submit');
    await testController.click(Selector('.swal-button--confirm'));
    await navBar.gotoForumsPage(testController);
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(2);
  }
}

export const forumsPage = new ForumsPage();
