import { Page } from '@playwright/test';
import { ConfigManager } from '../config/ConfigManager';
import { UIActions } from '@src/helper/actions/UIActions';
import { LoadState } from '@src/support/enum/LoadState';

/**
 * A generic navigation surface: go to a path, click a link by locator, and
 * assert the resulting URL. It carries no page-specific knowledge, which is
 * what lets one data-driven scenario cover every "parent page -> link ->
 * target URL" case in a fixture table.
 */
export class NavigationPage {
  private uiActions: UIActions;

  constructor(page: Page) {
    this.uiActions = new UIActions(page);
  }

  async goToPath(path: string): Promise<void> {
    const url = `${ConfigManager.getBaseUIUrl()}${path}`;
    await this.uiActions.page().gotoURL(url, `page ${path}`);
    await this.uiActions.page().waitForLoadState(LoadState.DOMCONTENTLOADED);
  }

  async clickLink(locator: string): Promise<void> {
    await this.uiActions.element(locator, `link ${locator}`).first().click();
  }

  async expectOnPath(path: string): Promise<void> {
    const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await this.uiActions
      .expect()
      .expectPageToHaveURL(new RegExp(`${escaped}(?:\\?.*)?$`), `URL should end at ${path}`);
  }
}
