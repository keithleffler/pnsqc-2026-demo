import { Locator, selectors } from '@playwright/test';
import { PageActions } from './PageActions';

/**
 * Instance-based locator factory. Reads the live page from `PageActions` on
 * every call so it always targets the currently active page/frame.
 */
export class LocatorFactory {
  constructor(private actions: PageActions) {}

  public getLocator(input: string | Locator): Locator {
    return typeof input === 'string' ? this.actions.getPage().locator(input) : input;
  }

  public getLocatorByTestId(testId: string | RegExp, attributeName?: string): Locator {
    if (attributeName) {
      selectors.setTestIdAttribute(attributeName);
    }
    return this.actions.getPage().getByTestId(testId);
  }

  public getLocatorByText(text: string | RegExp): Locator {
    return this.actions.getPage().getByText(text);
  }

  public getLocatorByLabel(text: string | RegExp): Locator {
    return this.actions.getPage().getByLabel(text);
  }

  public getLocatorByPlaceholder(text: string | RegExp): Locator {
    return this.actions.getPage().getByPlaceholder(text);
  }

  public getLocatorByTitle(text: string | RegExp): Locator {
    return this.actions.getPage().getByTitle(text);
  }

  public getLocatorByAltText(text: string | RegExp): Locator {
    return this.actions.getPage().getByAltText(text);
  }

  public async getAllLocators(input: string | Locator): Promise<Locator[]> {
    return typeof input === 'string'
      ? await this.actions.getPage().locator(input).all()
      : await input.all();
  }
}
