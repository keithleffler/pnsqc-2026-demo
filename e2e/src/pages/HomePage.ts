import { HomePageLocators } from '@src/support/locators/HomePageLocators';
import { Page } from '@playwright/test';
import { ConfigManager } from '../config/ConfigManager';
import { UIActions } from '@src/helper/actions/UIActions';
import { LoadState } from '@src/support/enum/LoadState';

export class HomePage {
  private uiActions: UIActions;
  constructor(page: Page) {
    this.uiActions = new UIActions(page);
  }

  async navigateToHome(): Promise<void> {
    const url = `${ConfigManager.getBaseUIUrl()}/index.htm`;
    await this.uiActions.page().gotoURL(url, 'Home Page');
    await this.uiActions.page().waitForLoadState(LoadState.DOMCONTENTLOADED);
  }

  async isLogoVisible(): Promise<void> {
    await this.uiActions
      .expect()
      .expectElementToBeVisible(HomePageLocators.PARABANK_LOGO, 'ParaBank logo should be visible', {
        timeout: 10000,
      });
  }

  async verifyLoginFields(fields: string[]): Promise<void> {
    for (const field of fields) {
      const selector =
        field.toLowerCase() === 'username'
          ? HomePageLocators.USERNAME_FIELD
          : HomePageLocators.PASSWORD_FIELD;
      await this.uiActions
        .expect()
        .expectElementToBeVisible(selector, `${field} field should be visible`);
    }
  }
}
